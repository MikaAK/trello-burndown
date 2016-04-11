defmodule TrelloBurndown.SprintSnapshot do
  use TrelloBurndown.Web, :model
  import IEx

  alias TrelloBurndown.Sprint
  alias TrelloBurndown.Repo
  alias TrelloBurndown.Trello
  alias TrelloBurndown.SprintSnapshot

  schema "sprint_snapshots" do
    field :points_left, :integer
    field :points_complete, :integer
    field :points_dev_complete, :integer

    belongs_to :sprint, TrelloBurndown.Sprint
    has_many :sprint_team_member_snapshots, TrelloBurndown.SprintTeamMemberSnapshot

    timestamps
  end

  @required_fields ~w(points_left points_complete points_dev_complete sprint_id)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end

  def take_snapshots do
   snapshots = create_snapshots_from_sprints Sprint.get_active

   Enum.each snapshots, fn(snapshot) ->
     Repo.insert snapshot
   end
  end

  defp create_snapshots_from_sprints(sprints) do
    Enum.map sprints, fn(sprint) ->
      with {:ok, board} <- Trello.get_board sprint.board_id, sprint.auth_token do
        dev_complete_points = calculate_list_points board.lists.dev_complete
        uncomplete_points = calculate_list_points board.lists.uncompleted
        completed_points = calculate_list_points board.lists.completed

        %SprintSnapshot{
          sprint_id: sprint.id,
          points_left: uncomplete_points,
          points_dev_complete: dev_complete_points,
          points_complete: completed_points
        }
      end
    end
  end

  defp calculate_list_points(lists) do
    Enum.reduce lists, 0, fn(list, acc) ->
      acc = acc + list.points
    end
  end
end
