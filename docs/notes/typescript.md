# TypeScript

## 基础类型

```typescript
// 基本类型
let name: string = "hello"
let count: number = 42
let isActive: boolean = true

// 数组
let list: number[] = [1, 2, 3]
let generic: Array<string> = ["a", "b"]

// 元组
let tuple: [string, number] = ["hello", 10]

// 枚举
enum Color { Red, Green, Blue }

// 联合类型
type Status = "idle" | "loading" | "error"

// 接口
interface User {
  name: string
  age?: number        // 可选
  readonly id: number // 只读
}
```

## 泛型

```typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg
}

// 泛型约束
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length
}

// 泛型工具类型
type PartialUser = Partial<User>     // 所有属性可选
type RequiredUser = Required<User>   // 所有属性必填
type PickName = Pick<User, 'name'>   // 选取部分属性
type OmitId = Omit<User, 'id'>       // 排除部分属性
```

## 高级类型

```typescript
// 条件类型
type IsString<T> = T extends string ? true : false

// 映射类型
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}

// infer 关键字
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
```

## 实用技巧

- 善用 `as const` 获得字面量类型
- `satisfies` 关键字（TS 4.9+）：既做类型检查又不收窄类型
- `ts-reset` 库收紧了部分内置类型的定义
