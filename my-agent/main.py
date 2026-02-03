import os

import fynq


def main() -> None:
    task = os.getenv("FYNQ_TASK", "Hello World")
    print(f"Received task: {task}")

    response = fynq.llm.chat(task)
    print(response)


if __name__ == "__main__":
    main()
