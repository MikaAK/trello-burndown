defmodule TrelloBurndown.HttpRequest do
  import IEx
  def get(url) do
    case HTTPoison.get url do
      {:ok, %HTTPoison.Response{body: body}} ->
        if (is_json body), do: decode_body(body), else: {:ok, body}
      value -> value
    end
  end

  def is_json(string), do: Regex.match?(~r/^({|\[).*(}|\])$/, string)

  defp decode_body(body) do
    case Poison.decode body do
      {:ok, data} -> {:ok, atomize_keys(data)}
      value -> value
    end
  end

  defp atomize_keys(data) when is_map(data) do
    for {key, val} <- data, into: %{} do
      key_name = String.to_atom(key)

      if (is_map(val) || is_list(val)) do
        {key_name, atomize_keys(val)}
      else
        {key_name, val}
      end
    end
  end
  
  defp atomize_keys(data) when is_list(data) do
    for item <- data, into: [], do: atomize_keys(item)
  end
end
