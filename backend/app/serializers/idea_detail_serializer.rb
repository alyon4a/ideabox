class IdeaDetailSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :image
  belongs_to :user
  has_many :up_votes
  has_many :implementors

  def up_votes 
    self.object.up_votes ? self.object.up_votes.length : 0
  end
end
