defmodule TrelloBurndown.HttpRequest do
  def get(url) do
    %HTTPoison.Response{body: body} = HTTPoison.get! url

    {:ok, data} = Poison.decode body

    atomize_keys data
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
