let currentAuthor = null;
const baseXPath = './/article//div[2]/div/div/div[1]/div';
const spanXPath = baseXPath + '/span/span/span';
const textXPath = baseXPath + '/span/text()';

function removeElementByXPath(xpath) {
    const element = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
    ).singleNodeValue;
    return element && removeParent(element, 12);
}

function removeParent(element, levels) {
    let currentElement = element;
    for (let i = 0; i < levels; i++) {
        if (currentElement.parentElement) {
            currentElement = currentElement.parentElement;
        }
        else {
            return false;
        }
    }
    currentElement.remove();
    return true;
}

function waitUntilDocumentIsReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

function findCommentAuthor(element) {
    const xpath = './/article//div[2]/div[2]/div[1]/div/div[1]/div/div/div[1]/div/a'
    const anchorElement = document.evaluate(
        xpath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
    ).singleNodeValue;
    if (anchorElement) {
        const hrefValue = anchorElement.getAttribute('href');
        return hrefValue;
    } else {
        return null;
    }
}


function setCurrentPostAuthor(element) {
    currentAuthor = findCommentAuthor(element);
}

function isCommentRelevant(element, likes = 50, retweets = 50, comments = 50) {
    if (document.evaluate(spanXPath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
        return false;
    }
    if (document.evaluate(textXPath, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue) {
        return false;
    }
    if (element.querySelector('svg[data-testid="icon-verified"]')) {
        return false;
    }
    return true;
}

waitUntilDocumentIsReady(() => {
    try {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    const ancestors = document.querySelectorAll('div[data-testid="cellInnerDiv"]');
                    if (ancestors.length > 0 && !currentAuthor) {
                        setCurrentPostAuthor(ancestors[0]);
                    }
                    ancestors.forEach((ancestor) => {
                        if (findCommentAuthor(ancestor) != currentAuthor && !isCommentRelevant(ancestor)) {
                            const child = ancestor.querySelector(':scope > div');
                            if (child) {
                                console.log('Hiding comment');
                                child.remove();
                            }
                        }
                    });
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (error) {
        console.error('Error: ', error);
    }
});
