defmodule TrelloBurndown.ModelChangeChannel do
  use Phoenix.Channel
  import Logger

  def join("model_change:update", _message, socket) do
    {:ok, socket}
  end

  def join("model_change:create", _message, socket) do
    {:ok, socket}
  end

  def broadcast_create(name, view, model) do
    render_set = Map.put %{}, String.to_atom(name), model

    Logger.info "#{name}:CREATED"
    IO.inspect render_set

    TrelloBurndown.Endpoint.broadcast! "model_change:create", name, view.render("show.json", render_set)
  end

  def broadcast_update(name, view, model) do 
    render_set = Map.put %{}, String.to_atom(name), model
    render_name = if is_list(model), do: "index.json", else: "show.json"

    Logger.info "#{name}:UPDATE"
    IO.inspect render_name
    IO.inspect render_set

    TrelloBurndown.Endpoint.broadcast! "model_change:update", name, view.render(render_name, render_set)
  end
end
