Simple additions
- Frontend form validation of matching passwords without form submission 
- Ability to logout and unlike posts
- Different nav bars according to the size of the screen
- Push notification tells you what user that you're following made a new post
- Comments are shown in order of most recent 
- Posts on the profile pages are shown in order of most recent
- Posts returned on search are shown in order of most recent
- Live feed, search results and profile page updates with new post when a user you follow adds a post

Searching 
- Logged in users can search through their feed or for a user by entering an input in the search bar located in the nav bar
- Defaults to search through the users feed but can select to search by feed or by user using a select element next to the search bar
- For searching by feed: after pressing the search icon, a result page is rendered showing the number of results. Posts that are returned are those where the input is found in the description. The user can interact with the resultant posts e.g. like, comment, go to the user's profile
- For searching by user: after pressing the search icon, a result page is rendered showing a user if the username exists. The user can also select this username and go to their homepage where they can follow them or like/comment on their posts
- If no results are found, appropriate messages are shown on the result page
- This bonus feature makes it more usable as they can easily find posts or users

Discover posts page instead of an empty feed for new users or users without a feed
- On the home/feed page, if the users have 0 posts in their feed, a message on the screen tells them this but also shows a list of 15 or so random posts
- This was achieved by making a list of 15 randomly generated numbers from 1 to 100 (this range appeared appropriate for this database but the function that produces the list can take different inputs to increase it)
- Posts are then found by using these random numbers as post ids, removing those that do not exist (due to deleting of posts)
- This bonus feature provides a way for new users or those that are not following people to find a whole range of posts and find posts or users they would like to follow. Also, since on refresh, they see another bunch of random posts, this increases the chance that they will discover people they want to interact with. 