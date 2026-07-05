# Rust

## 所有权

Rust 最核心的特性——所有权系统：

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;              // s1 被移动，不再有效
    // println!("{}", s1);   // 编译错误！
    
    let s3 = s2.clone();      // 深拷贝
    println!("{} {}", s2, s3); // 都能用
}
```

## 借用与引用

```rust
fn main() {
    let mut s = String::from("hello");
    
    // 不可变引用（可以有多个）
    let r1 = &s;
    let r2 = &s;
    
    // 可变引用（同一时间只能有一个）
    let r3 = &mut s;
    r3.push_str(" world");
}
```

## 生命周期

```rust
// 生命周期标注
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}
```

## 常见集合

```rust
// Vector
let mut v: Vec<i32> = Vec::new();
v.push(1);
let third = v.get(2);  // Option<&i32>，安全

// HashMap
use std::collections::HashMap;
let mut map = HashMap::new();
map.insert("key", "value");

// String vs &str
let s: String = String::from("owned");  // 堆上，拥有所有权
let slice: &str = "borrowed";           // 借用，字符串字面量
```

## 错误处理

```rust
// Result
fn divide(a: i32, b: i32) -> Result<i32, String> {
    if b == 0 {
        Err(String::from("除零错误"))
    } else {
        Ok(a / b)
    }
}

// ? 操作符
fn read_file() -> Result<String, std::io::Error> {
    let content = std::fs::read_to_string("file.txt")?;
    Ok(content)
}
```

## Cargo 常用命令

```bash
cargo new project_name     # 创建项目
cargo build                # 编译
cargo run                  # 编译并运行
cargo test                 # 运行测试
cargo fmt                  # 格式化代码
cargo clippy               # 代码检查
```
