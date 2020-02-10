class CommentsController < ApplicationController
    def userComments
        userId = params[:id]
        comments = Comment.userComments(userId)
        render json: comments, status: 201
    end

    def ideaComments
        userId = params[:id]
        comments = Comment.ideaComments(userId)
        render json: comments, status: 201
    end
end
