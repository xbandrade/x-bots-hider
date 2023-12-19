const parseInput = inputValue => {
    const parsedValue = inputValue !== '' ? parseInt(inputValue) : 0;
    return parsedValue !== null && parsedValue >= 0 ? parsedValue : 0;
};

document.addEventListener('DOMContentLoaded', () => {
    const likesInput = document.getElementById('likes');
    const retweetsInput = document.getElementById('retweets');
    const commentsInput = document.getElementById('comments');
    const likesCheckbox = document.getElementById('likesCheckbox');
    const retweetsCheckbox = document.getElementById('retweetsCheckbox');
    const commentsCheckbox = document.getElementById('commentsCheckbox');
    const saveButton = document.getElementById('saveButton');
    function saveOptionsAndRefresh() {
        const likes = likesCheckbox.checked ? parseInput(likesInput.value) : null;
        const retweets = retweetsCheckbox.checked ? parseInput(retweetsInput.value) : null;
        const comments = commentsCheckbox.checked ? parseInput(commentsInput.value) : null;
        chrome.storage.sync.set({
            likes: likes !== null ? likes : 30,
            retweets: retweets !== null ? retweets : 15,
            comments: comments !== null ? comments : 10,
            likesCheckbox: likesCheckbox.checked,
            retweetsCheckbox: retweetsCheckbox.checked,
            commentsCheckbox: commentsCheckbox.checked
        }, () => {
            chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
                chrome.tabs.reload(tabs[0].id);
            });

            const views = chrome.extension.getViews({ type: 'popup' });
            if (views.length > 0) {
                views[0].close();
            }
        });
    }
    chrome.storage.sync.get(
        { likes: 30, retweets: 15, comments: 10, likesCheckbox: true, retweetsCheckbox: true, commentsCheckbox: true },
        function (preferences) {
            likesInput.value = preferences.likes;
            retweetsInput.value = preferences.retweets;
            commentsInput.value = preferences.comments;
            likesCheckbox.checked = preferences.likesCheckbox;
            retweetsCheckbox.checked = preferences.retweetsCheckbox;
            commentsCheckbox.checked = preferences.commentsCheckbox;
            likesInput.disabled = !likesCheckbox.checked;
            retweetsInput.disabled = !retweetsCheckbox.checked;
            commentsInput.disabled = !commentsCheckbox.checked;
        }
    );
    saveButton.addEventListener('click', saveOptionsAndRefresh);
    likesCheckbox.addEventListener('change', () => {
        likesInput.disabled = !likesCheckbox.checked;
    });
    retweetsCheckbox.addEventListener('change', () => {
        retweetsInput.disabled = !retweetsCheckbox.checked;
    });
    commentsCheckbox.addEventListener('change', () => {
        commentsInput.disabled = !commentsCheckbox.checked;
    });
});
