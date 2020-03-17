const BASE_URL = 'https://hack-or-snooze-v3.herokuapp.com';
const token = 'token';

class Story {
  /**
   * The constructor is designed to take an object for better readability / flexibility
   * - storyObj: an object that has story properties in it
   */
  constructor(storyObj) {
    this.author = storyObj.author;
    this.title = storyObj.title;
    this.url = storyObj.url;
    this.username = storyObj.username;
    this.storyId = storyObj.storyId;
    this.createdAt = storyObj.createdAt;
    this.updatedAt = storyObj.updatedAt;
  }
}

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /**
   * This method is designed to be called to generate a new StoryList.
   *  It:
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.*
   */

  // TODO: Note the presence of `static` keyword: this indicates that getStories
  // is **not** an instance method. Rather, it is a method that is called on the
  // class directly. Why doesn't it make sense for getStories to be an instance method?
  // **because it's an async function**.

  static async getStories() {
    // query the /stories endpoint (no auth required)
    const response = await axios.get(`${BASE_URL}/stories`);

    // turn the plain old story objects from the API into instances of the Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    const storyList = new StoryList(stories);
    return storyList;
  }

  /**
   * Method to make a POST request to /stories and add the new story to the list
   * - user - the current instance of User who will post the story
   * - newStory - a new story object for the API with title, author, and url
   *
   * Returns the new story object
   */

  async addStory(user, newStory) {
    // TODO - Implement this functions!
    // this function should return the newly created story so it can be used in
    // the script.js file where it will be appended to the DOM
    const { author, title, url } = newStory; // destruc the story's data
    let request = await axios.post(`${BASE_URL}/stories`, {
      token: user.loginToken,
      story: {
        author,
        title,
        url
      }
    });
    request = request.data.story;
    const story = new Story(request); // newly created story

    return story;
  }
}

class User {
  constructor(userObj) {
    this.username = userObj.username;
    this.name = userObj.name;
    this.createdAt = userObj.createdAt;
    this.updatedAt = userObj.updatedAt;

    // these are all set to defaults, not passed in by the constructor
    this.loginToken = '';
    this.favorites = [];
    this.ownStories = [];
  }

  static async create(username, password, name) {
    // create a try/catch block to test if creating a user works
    try {
      const response = await axios.post(`${BASE_URL}/signup`, {
        user: {
          username,
          password,
          name
        }
      });

      // build a new User instance from the API response
      const newUser = new User(response.data.user);

      // attach the token to the newUser instance for convenience
      newUser.loginToken = response.data.token;

      return newUser;
    } catch (error) {
      return error;
    }
  }

  static async login(username, password) {
    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        user: {
          username,
          password
        }
      });
      // build a new User instance from the API response
      const existingUser = new User(response.data.user);

      // instantiate Story instances for the user's favorites and ownStories
      existingUser.favorites = response.data.user.favorites.map(s => new Story(s));
      existingUser.ownStories = response.data.user.stories.map(s => new Story(s));

      // attach the token to the newUser instance for convenience
      existingUser.loginToken = response.data.token;

      return existingUser;
    } catch (error) {
      return error;
    }
  }
  static async getLoggedInUser(token, username) {
    // if we don't have user info, return null
    if (!token || !username) return null;

    // call the API
    const response = await axios.get(`${BASE_URL}/users/${username}`, {
      params: { token }
    });

    // instantiate the user from the API information
    const existingUser = new User(response.data.user);

    // attach the token to the newUser instance for convenience
    existingUser.loginToken = token;

    // instantiate Story instances for the user's favorites and ownStories
    existingUser.favorites = response.data.user.favorites.map(s => new Story(s));
    existingUser.ownStories = response.data.user.stories.map(s => new Story(s));

    return existingUser;
  }

  // Add Favorties Section here
}
