document.addEventListener('DOMContentLoaded', function () {
    const likesInput = document.getElementById('likes');
    const retweetsInput = document.getElementById('retweets');
    const commentsInput = document.getElementById('comments');
    const saveButton = document.getElementById('saveButton');
    function saveOptionsAndRefresh() {
        const likes = parseInt(likesInput.value) || 30;
        const retweets = parseInt(retweetsInput.value) || 15;
        const comments = parseInt(commentsInput.value) || 10;
        chrome.storage.sync.set({ likes, retweets, comments }, function () {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.tabs.reload(tabs[0].id);
            });
        });
    }
    chrome.storage.sync.get(
        { likes: 30, retweets: 10, comments: 10 },
        function (preferences) {
            likesInput.value = preferences.likes;
            retweetsInput.value = preferences.retweets;
            commentsInput.value = preferences.comments;
        }
    );
    saveButton.addEventListener('click', saveOptionsAndRefresh);
});
