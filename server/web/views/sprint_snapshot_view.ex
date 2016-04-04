defmodule TrelloBurndown.SprintSnapshotView do
  use TrelloBurndown.Web, :view

  def render("index.json", %{sprint_snapshots: sprint_snapshots}) do
    %{data: render_many(sprint_snapshots, TrelloBurndown.SprintSnapshotView, "sprint_snapshot.json")}
  end

  def render("show.json", %{sprint_snapshot: sprint_snapshot}) do
    %{data: render_one(sprint_snapshot, TrelloBurndown.SprintSnapshotView, "sprint_snapshot.json")}
  end

  def render("sprint_snapshot.json", %{sprint_snapshot: sprint_snapshot}) do
    params = %{
      id: sprint_snapshot.id,
      date: sprint_snapshot.date,
      points_left: sprint_snapshot.points_left,
      points_complete: sprint_snapshot.points_complete,
      points_dev_complete: sprint_snapshot.points_dev_complete,
      sprint_id: sprint_snapshot.sprint_id
    }

    if Ecto.assoc_loaded? sprint_snapshot.sprint_team_member_snapshots do
      json = "sprint_team_member_snapshot.json"
       |> TrelloBurndown.SprintTeamMemberSnapshotView.render(sprint_snapshot.sprint_team_member_snapshots)

      Map.set params, :sprint_team_member_snapshots, json
    else
      params
    end
  end
end
