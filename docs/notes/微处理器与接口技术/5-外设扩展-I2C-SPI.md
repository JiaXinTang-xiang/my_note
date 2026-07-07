# 51 外设扩展 — I2C 与 SPI

## 一、I2C — PCF8591（8 位 ADC + DAC）

### 芯片特性

| 参数 | 值 |
|------|------|
| ADC 分辨率 | **8 位**（4 通道） |
| DAC 分辨率 | **8 位** |
| 通信接口 | I2C（最高 100kHz） |
| 转换时间 | 单次 ADC/DAC **约 90μs** |
| 工作电压 | 2.5V ~ 6V |

### 引脚定义

| 引脚 | 功能 |
|------|------|
| AIN0～AIN3 | 4 路模拟信号输入 |
| A0～A2 | I2C 硬件地址脚 |
| SDA、SCL | I2C 数据线、时钟线 |
| AOUT | D/A 模拟输出 |
| VREF | 基准电压 |
| OSC | 外部时钟输入 |

### ADC 转换公式

$$V_{in} = V_{REF} \times \frac{D}{256}$$

$$ADC\ 分辨率 = \frac{V_{REF}}{256}$$

> 当 VREF = 5V 时，最小分辨电压为 **19.53mV**。

---

### I2C 寻址字节

假设 A2、A1、A0 都接地：

| 操作 | 地址 |
|------|------|
| 写操作 | `0x90` |
| 读操作 | `0x91` |

```c
#define AddrWR  0x90
#define AddrRD  0x91
```

---

### 控制寄存器

| 位 | 功能 |
|------|------|
| D7 | 固定为 0 |
| D6 | 模拟量输出允许（1=允许 DAC） |
| D5、D4 | 模拟输入方式：00=四路单端，01=三路差分，10=单端+差分，11=两路差分 |
| D3 | 固定为 0 |
| D2 | 自动加 1 选择通道（1=使能） |
| D1、D0 | 通道选择：00=CH0，01=CH1，10=CH2，11=CH3 |

**练习**：选择通道 2，禁用自动加 1，单端输入，禁用模拟输出

$$控制字 = 0000\ 0010 = 0x02$$

> D6=0（禁用 DAC）、D5/D4=00（单端）、D2=0（不自动加 1）、D1/D0=10（通道 2）

---

### A/D 转换驱动函数

```c
uchar PCF8591_ADC(uchar ch)
{
    uchar dat;
    Start();                    // I2C 起始信号
    SendByte(0x90);            // 写寻址字节
    Ack();                     // 读从机应答
    SendByte(0x40 | ch);       // 写控制字，选择 A/D 通道
    Ack();                     // 读 A/D 应答
    Start();                    // 重复起始
    SendByte(0x91);            // 读 A/D 转换结果
    Ack();                     // 读从机应答
    dat = RcvByte();           // 开始读转换结果
    NoAck();                   // 主机发 NACK，只读 1 次
    Stop();                    // I2C 停止信号
    return dat;
}
```

> **注意事项**：
> 1. 写控制字前需要先写从机地址
> 2. 读到的是**上一次**转换的结果（需先启一次转换，再读）
> 3. 这就是为什么代码中要先写控制字，再发一次起始+读地址

### D/A 转换驱动函数

```c
void PCF8591_DAC(uchar dat)
{
    Start();
    SendByte(0x90);   // 写寻址字节
    Ack();
    SendByte(0x40);   // 写控制字（D6=1，允许 DAC）
    Ack();
    SendByte(dat);    // 写待转换的数字量
    NoAck();
    Stop();
}
```

---

## 二、SPI — TLC549（8 位 ADC）

### 引脚定义

| 引脚 | 功能 |
|------|------|
| REF+、REF- | 基准电压（2.5V ≤ REF+ ≤ VCC+0.1V） |
| CS | 片选，低电平有效 |
| DATA OUT | 数据串行输出 |
| ANALOG IN | 模拟信号输入 |
| I/O CLOCK | 时钟输入（≤ 1.1MHz） |

### 转换公式

$$V_{in} = (V_{REF+} - V_{REF-}) \times \frac{D}{256}$$

> 当 REF+=5V，REF- = 0V 时：$V_{in} = 5 \times \frac{D}{256} = 0.01953125 \times D$

### 工作时序要点

- CS 拉低 → 启动一次读，同时启动新转换
- 在 **CLOCK 下降沿** 读每一位
- CS 拉高 → 结束本次传输，等待 ≥ 17μs

### 接口函数

```c
#define uchar unsigned char

sbit TLC549_CLK = P2^3;
sbit TLC549_DO  = P2^4;
sbit TLC549_CS  = P2^5;

uchar TLC549_ADC(void)
{
    uchar i, temp;
    TLC549_CLK = 0;
    TLC549_CS  = 0;        // 片选，启动转换

    for(i = 0; i < 8; i++)
    {
        temp <<= 1;
        temp |= TLC549_DO;  // 读当前位
        TLC549_CLK = 1;     // 采样下一位
        TLC549_CLK = 0;     // 准备读
    }

    TLC549_CS = 1;          // 取消选中
    delayus(20);            // 等待转换完成
    return temp;            // 返回 8 位数据
}
```

---

## 三、SPI — TLC5615（10 位 DAC）

### 引脚定义

| 引脚 | 功能 |
|------|------|
| DIN | 串行数据输入 |
| SCLK | 串行时钟（≤ 14MHz） |
| CS | 片选，低有效 |
| DOUT | 级联数据输出 |
| REFIN | 基准电压（2V～VDD-2V） |
| OUT | DAC 模拟电压输出 |

### 转换公式

$$V_{OUT} = 2 \times V_{REF} \times \frac{D}{1024}$$

### 帧格式

两种可选：12 位或 16 位

- **12 位格式**：数据左移 6 位（`dat <<= 6`），传 12 个时钟
- **16 位格式**：数据左移 2 位（`dat <<= 2`），传 16 个时钟

### 12 位接口函数

```c
void TLC5615_DAC(uint dat)
{
    uchar i;
    dat <<= 6;                   // 左移 6 位，补 6 个 0

    TLC5615_CLK = 0;
    TLC5615_CS  = 0;

    for(i = 0; i < 12; i++)
    {
        TLC5615_DI = (bit)(dat & 0x8000);  // 取 MSB
        TLC5615_CLK = 0;
        dat <<= 1;
        TLC5615_CLK = 1;                    // 输入当前位
    }

    TLC5615_CS  = 1;
    TLC5615_CLK = 0;
    delayus(20);                            // 建立时间 ≥ 12.5μs
}
```

### 16 位接口函数

```c
void TLC5615_DAC(uint dat)
{
    uchar i;
    dat <<= 2;                   // 左移 2 位，补 2 个 0

    TLC5615_CLK = 0;
    TLC5615_CS  = 0;

    for(i = 0; i < 16; i++)
    {
        TLC5615_DI = (bit)(dat & 0x8000);
        TLC5615_CLK = 0;
        dat <<= 1;
        TLC5615_CLK = 1;
    }

    TLC5615_CS  = 1;
    TLC5615_CLK = 0;
    delayus(20);
}
```

---

## 应用：正弦波发生器（TLC5615）

每隔 1ms 输出一个正弦波数据，256 个点频率约 4Hz：

```c
#include <reg52.h>
#define uchar unsigned char
#define uint unsigned int

uchar code sin[256] = {/* 正弦波表，预计算 */};

uint count = 0;             // 正弦波表下标

sbit TLC5615_DI  = P2^0;
sbit TLC5615_CLK = P2^1;
sbit TLC5615_CS  = P2^2;

void main(void)
{
    // T0 方式 1，1ms 定时
    TMOD |= 0x01;
    TH0 = (65536 - 1000) / 256;
    TL0 = (65536 - 1000) % 256;

    EA  = 1;        // 开总中断
    ET0 = 1;        // 开 T0 中断
    TR0 = 1;        // 启动 T0

    while(1);       // 空循环，等待中断
}

void T0_ISR() interrupt 1
{
    TH0 = (65536 - 1000) / 256;    // 重装初值
    TL0 = (65536 - 1000) % 256;

    TLC5615_DAC(sin[count]);       // 输出正弦波
    if(++count == 256)
        count = 0;
}
```

---

## TLC549 + LCD1602 电压表

采集电压并显示在 LCD1602 第 1 行中间：

```c
TMOD |= 0x01;
TH0 = (65536 - 1000)/256;  // 1ms
TL0 = (65536 - 1000)%256;
// ... 初始化 ...

void main(void)
{
    uint temp;
    lcd_ini();                    // LCD 初始化
    while(1)
    {
        temp = TLC549_ADC();

        w_com(0x84);                                   // 第 1 行第 5 列
        w_dat(temp * 195 / 10000 + 0x30);             // 电压个位数
        w_dat('.');                                     // 小数点
        w_dat(temp * 195 % 10000 / 1000 + 0x30);      // 第 1 位小数
        w_dat(temp * 195 % 1000 / 100 + 0x30);        // 第 2 位小数
        w_dat('V');
    }
}
```

> `temp * 195 / 10000` 实际是 $D \times \frac{5}{256} \times \frac{1}{10} \approx D \times 0.00195$（因用整数运算简化为乘 195 除 10000）。

---

## I2C vs SPI 对比

| | I2C | SPI |
|------|------|------|
| 数据线 | 2 根（SDA、SCL） | 至少 3 根（MOSI、MISO、SCK）+ 片选 |
| 速度 | 标准 100kHz / 快速 400kHz | 最高 10MHz+ |
| 寻址 | 器件地址（7 位 / 10 位） | 片选线（CS） |
| 应答 | 每字节有 ACK | 无应答机制 |
| 优点 | 总线挂多个器件，引脚少 | 速度快，全双工 |
| 51 实例 | PCF8591 | TLC549、TLC5615 |
