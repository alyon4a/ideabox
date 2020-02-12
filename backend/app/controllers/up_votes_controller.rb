class UpVotesController < ApplicationController
    def create
        params = up_vote_params
        upVote = UpVote.find_by(user_id: params["user_id"], idea_id: params["idea_id"])
        if(!upVote)
            upVote = UpVote.create(params)
            render json: upVote, status: 201
        else
            render status: 412
        end
    end

    def destroy
        upVote = UpVote.find(params["id"])
        if(upVote)
            upVote.destroy
            render json: true, status: 201
        else
            render status: 412
        end
    end

    private
    def up_vote_params
        params.require(:up_vote).permit(:user_id, :idea_id)
    end
end