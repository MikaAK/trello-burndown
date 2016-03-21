defmodule TrelloBurndown.ModelChangeChannel do
  use Phoenix.Channel

  def join("model_change:update", _message, socket) do
    {:ok, socket}
  end

  def join("model_change:create", _message, socket) do
    {:ok, socket}
  end

  def broadcast_create(name, view, model) do
    render_set = Map.put %{}, String.to_atom(name), model

    IO.puts "CREATED"
    IO.inspect(render_set)

    TrelloBurndown.Endpoint.broadcast! "model_change:create", name, view.render("show.json", render_set)
  end

  def broadcast_update(name, view, model) when is_list model do 
    render_set = Map.put %{}, String.to_atom(name), model

    IO.inspect(render_set)

    TrelloBurndown.Endpoint.broadcast! "model_change:update", name, view.render("index.json", render_set)
  end

  def broadcast_update(name, view, model) do
    render_set = Map.put %{}, String.to_atom(name), model

    IO.inspect(render_set)

    TrelloBurndown.Endpoint.broadcast! "model_change:update", name, view.render("show.json", render_set)
  end
end
