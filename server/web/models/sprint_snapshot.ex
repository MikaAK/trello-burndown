defmodule TrelloBurndown.SprintSnapshot do
  use TrelloBurndown.Web, :model

  schema "sprint_snapshots" do
    field :date, Ecto.Date
    field :points_left, :integer
    field :points_complete, :integer
    field :points_dev_complete, :integer

    belongs_to :sprint, TrelloBurndown.Sprint
    has_many :sprint_team_member_snapshots, TrelloBurndown.SprintTeamMemberSnapshot

    timestamps
  end

  @required_fields ~w(date points_left points_complete points_dev_complete sprint_id)
  @optional_fields ~w(sprint_team_member_snapshots)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
