class User < ApplicationRecord
    has_many :ideas
    has_many :comments
    has_many :commented_ideas, through: :comments, source: :idea
    has_many :up_votes
    has_many :up_votes_ideas, through: :up_votes, source: :idea
    has_many :implementors
    has_many :ideas_implemented, through: :implementors, source: :idea
end