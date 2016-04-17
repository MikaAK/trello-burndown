defmodule TrelloBurndown.SprintTeamMemberSnapshotController do
  use TrelloBurndown.Web, :controller

  alias TrelloBurndown.SprintTeamMemberSnapshot

  plug :scrub_params, "sprint_team_member_snapshot" when action in [:create, :update]

  def index(conn, _params) do
    sprint_team_member_snapshots = Repo.all(SprintTeamMemberSnapshot)
    render(conn, "index.json", sprint_team_member_snapshots: sprint_team_member_snapshots)
  end

  def create(conn, sprint_team_member_snapshot_params) do
    changeset = SprintTeamMemberSnapshot.changeset(%SprintTeamMemberSnapshot{}, sprint_team_member_snapshot_params)

    case Repo.insert(changeset) do
      {:ok, sprint_team_member_snapshot} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", sprint_team_member_snapshot_path(conn, :show, sprint_team_member_snapshot))
        |> render("show.json", sprint_team_member_snapshot: sprint_team_member_snapshot)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    sprint_team_member_snapshot = Repo.get!(SprintTeamMemberSnapshot, id)
    render(conn, "show.json", sprint_team_member_snapshot: sprint_team_member_snapshot)
  end

  def update(conn, sprint_team_member_snapshot_params) do
    changeset = Repo.get!(SprintTeamMemberSnapshot, sprint_team_member_snapshot_params["id"])
      |> SprintTeamMemberSnapshot.changeset(sprint_team_member_snapshot_params)

    case Repo.update(changeset) do
      {:ok, sprint_team_member_snapshot} ->
        render(conn, "show.json", sprint_team_member_snapshot: sprint_team_member_snapshot)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    sprint_team_member_snapshot = Repo.get!(SprintTeamMemberSnapshot, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(sprint_team_member_snapshot)

    send_resp(conn, :no_content, "")
  end
end
