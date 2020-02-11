class IdeaSerializer < ActiveModel::Serializer
  attributes :id, :title, :description, :image
  has_many :up_votes
  has_many :implementors
  def up_votes 
    self.object.up_votes ? self.object.up_votes.length : 0
  end
  def implementors 
    self.object.implementors ? self.object.implementors.length : 0
  end
end
