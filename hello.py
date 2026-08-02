import random


def greet(name: str) -> str:
    return f"Hello, {name}!"


def roll_dice(sides: int = 6) -> int:
    return random.randint(1, sides)


if __name__ == "__main__":
    print(greet("world"))
    print(f"You rolled a {roll_dice()}")
