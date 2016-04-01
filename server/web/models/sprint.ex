defmodule TrelloBurndown.Sprint do
  use TrelloBurndown.Web, :model

  schema "sprints" do
    field :board_id, :string
    field :sprint_name, :string
    field :holidays, {:array, :integer}
    field :points, :integer
    field :start_date, Ecto.Date
    field :end_date, Ecto.Date
    belongs_to :team, TrelloBurndown.Team

    timestamps
  end

  @required_fields ~w(board_id sprint_name team_id)
  @optional_fields ~w(holidays points start_date end_date)

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
