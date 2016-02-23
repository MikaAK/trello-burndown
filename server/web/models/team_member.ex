defmodule TrelloBurndown.TeamMember do
  use TrelloBurndown.Web, :model

  schema "team_members" do
    field :velocity, :float
    field :trello_id, :string
    field :admin, :boolean
    belongs_to :team, TrelloBurndown.Team

    timestamps
  end

  @required_fields ~w(velocity trello_id team_id)
  @optional_fields ~w(admin)

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
