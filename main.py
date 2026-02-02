import os

import fynq


def main() -> None:
    task = os.getenv("FYNQ_TASK", "No task provided")

    print(f"Agent received task: {task}")

    response = fynq.llm.chat(
        user_query=f"Write a short, funny poem about: {task}",
        system_prompt="You are a poetic assistant.",
    )

    print("\n--- Agent Output ---")
    print(response)


if __name__ == "__main__":
    main()
