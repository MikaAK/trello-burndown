defmodule TrelloBurndown.SprintView do
  import IEx
  use TrelloBurndown.Web, :view

  def render("index.json", %{sprints: sprints}) do
    %{data: render_many(sprints, TrelloBurndown.SprintView, "sprint.json")}
  end

  def render("show.json", %{sprint: sprint}) do
    %{data: render_one(sprint, TrelloBurndown.SprintView, "sprint.json")}
  end

  def render("sprint.json", %{sprint: sprint}) do
    params = %{id: sprint.id,
      board_id: sprint.board_id,
      sprint_name: sprint.sprint_name,
      point_total: sprint.point_total,
      team_id: sprint.team_id,
      holidays: sprint.holidays
    }

    if Ecto.assoc_loaded? sprint.team do
      json = TrelloBurndown.TeamView.render "team.json", %{team: Map.get(sprint, :team)}

      Map.put(params, :team, json)
    else
      params
    end
  end
end
