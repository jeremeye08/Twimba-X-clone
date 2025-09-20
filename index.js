import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    } else if(e.target.dataset.comment){
        handleCommentBtnClick(e.target.dataset.comment)
    } else if(e.target.dataset.delete){
        handleDeleteBtnClick(e.target.dataset.delete)
    }
})
 

function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render(tweetsData)
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render(tweetsData) 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render(tweetsData)
    tweetInput.value = ''
    }

}

function handleCommentBtnClick(tweetId){
    const commentInput = document.getElementById(`tweet-comment-${tweetId}`).value

    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    const newCommentObj = {
        handle: `@Scrimba`,
        profilePic: `images/scrimbalogo.png`,
        tweetText: `${commentInput}`
    }
    
    if(commentInput){
        targetTweetObj.replies.push(newCommentObj)
        console.log(targetTweetObj.replies)
        render(tweetsData)
    }
    
}

function handleDeleteBtnClick(tweetId){
    const tweetIndex = tweetsData.findIndex(tweet => tweet.uuid === tweetId)
    if (tweetIndex > -1) {
        tweetsData.splice(tweetIndex, 1)
    }
    render(tweetsData)
}

function getFeedHtml(mainArray){
    let feedHtml = ``
    
    mainArray.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let deleteDivClass = tweet.handle === "@Scrimba" ? "delete-div" : "delete-div hidden"

        let commentHtml = `
<div class="tweet-comment">
    <img src="/images/scrimbalogo.png" class="mini-profile-pic">
    <textarea placeholder="Reply to ${tweet.handle}'s post" id="tweet-comment-${tweet.uuid}"></textarea>
    <i class="fa-solid fa-paper-plane"
    data-comment="${tweet.uuid}"
    ></i>
</div>`

        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){


                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
            </div>   
        </div>
        <div class=${deleteDivClass}>
            <i class="fa-solid fa-trash"
            data-delete="${tweet.uuid}"
            ></i>
        </div>
    </div>
    <div id="replies-${tweet.uuid}" class="hidden">
        ${repliesHtml}
        ${commentHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}



function render(renderMain){
    document.getElementById('feed').innerHTML = getFeedHtml(renderMain)
}

render(tweetsData)

