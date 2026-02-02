import os

from litellm import completion


def chat(user_query: str, system_prompt: str | None = None) -> str:
    """
    Developer-facing function to call the AI.
    It automatically uses the model configured by the CLI/Runtime.
    """
    model = os.getenv("FYNQ_MODEL", "mistral/mistral-tiny")

    messages: list[dict[str, str]] = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})

    messages.append({"role": "user", "content": user_query})

    response = completion(
        model=model,
        messages=messages,
    )

    return response.choices[0].message.content
