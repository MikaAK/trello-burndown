defmodule TrelloBurndown.TeamMemberController do
  use TrelloBurndown.Web, :controller

  alias TrelloBurndown.TeamMember

  def index(conn, _params) do
    team_members = Repo.all(TeamMember)
    render(conn, "index.json", team_members: team_members)
  end

  def create(conn, team_member_params) do
    changeset = TeamMember.changeset(%TeamMember{}, team_member_params)

    case Repo.insert(changeset) do
      {:ok, team_member} ->
        conn
        |> put_status(:created)
        |> put_resp_header("location", team_member_path(conn, :show, team_member))
        |> render("show.json", team_member: team_member)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}) do
    team_member = Repo.get!(TeamMember, id)
    render(conn, "show.json", team_member: team_member)
  end

  def update(conn, team_member_params) do
    changeset = Repo.get!(TeamMember, team_member_params["id"])
      |> TeamMember.changeset(team_member_params)

    case Repo.update(changeset) do
      {:ok, team_member} ->
        render(conn, "show.json", team_member: team_member)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(TrelloBurndown.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}) do
    team_member = Repo.get!(TeamMember, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(team_member)

    send_resp(conn, :no_content, "")
  end
end
