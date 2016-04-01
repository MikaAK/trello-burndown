defmodule TrelloBurndown.SprintController do
  use TrelloBurndown.Web, :controller

  alias TrelloBurndown.Sprint
  alias TrelloBurndown.ModelChangeChannel

  def index(conn, _params) do
    sprints = Repo.all(from s in Sprint, preload: [team: :team_members])

    render(conn, "index.json", sprints: sprints)
  end

  def create(conn, sprint_params) do
    changeset = Sprint.changeset(%Sprint{}, sprint_params)

    case Repo.insert(changeset) do
      {:ok, sprint} ->
        sprint = Repo.preload sprint, :team

        broadcast_create(sprint)

        conn
        |> put_status(:created)
        |> put_resp_header("location", sprint_path(conn, :show, sprint))
        |> render("show.json", sprint: sprint)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    sprint = from(s in Sprint, preload: [:team])
      |> Repo.get!(id)

    render(conn, "show.json", sprint: sprint)
  end

  def update(conn, sprint_params) do
    changeset = from(s in Sprint, preload: [:team])
      |> Repo.get!(Map.get(sprint_params, "id"))
      |> Sprint.changeset(sprint_params)

    case Repo.update(changeset) do
      {:ok, sprint} ->
        broadcast_update(sprint)

        render(conn, "show.json", sprint: sprint)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    sprint = Repo.get!(Sprint, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(sprint)

    send_resp(conn, :no_content, "")
  end

  defp broadcast_update(model) do
    ModelChangeChannel.broadcast_update("sprint", TrelloBurndown.SprintView, model)
  end

  defp broadcast_create(model) do
    ModelChangeChannel.broadcast_create("sprint", TrelloBurndown.SprintView, model)
  end
end
