defmodule TrelloBurndown.SprintSnapshotController do
  use TrelloBurndown.Web, :controller

  alias TrelloBurndown.SprintSnapshot

  def index(conn, _params) do
    sprint_snapshots = Repo.all(SprintSnapshot, preload: :sprint_team_member_snapshots)
    render(conn, "index.json", sprint_snapshots: sprint_snapshots)
  end

  def create(conn, %{"sprint_snapshot" => sprint_snapshot_params}) do
    changeset = SprintSnapshot.changeset(%SprintSnapshot{}, sprint_snapshot_params)

    case Repo.insert(changeset) do
      {:ok, sprint_snapshot} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", sprint_snapshot_path(conn, :show, sprint_snapshot))
        |> render("show.json", sprint_snapshot: sprint_snapshot)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    sprint_snapshot = from(s in Sprint, preload: [:team])
      |> Repo.get!(id)

    render(conn, "show.json", sprint_snapshot: sprint_snapshot)
  end

  def update(conn, %{"id" => id, "sprint_snapshot" => sprint_snapshot_params}) do
    sprint_snapshot = Repo.get!(SprintSnapshot, id)
    changeset = SprintSnapshot.changeset(sprint_snapshot, sprint_snapshot_params)

    case Repo.update(changeset) do
      {:ok, sprint_snapshot} ->
        render(conn, "show.json", sprint_snapshot: sprint_snapshot)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    sprint_snapshot = Repo.get!(SprintSnapshot, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(sprint_snapshot)

    send_resp(conn, :no_content, "")
  end
end
