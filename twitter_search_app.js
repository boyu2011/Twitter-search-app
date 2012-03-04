enyo.kind({
  name: "Tweet",
  kind: enyo.Control,
  tag: "div",
  style: "border-style: solid; border-width: 2px; " +
         "padding: 10px; margin: 10px; min-height: 50px",

  published: {
    icon: "",
    handle: "",
    text: ""
  },

  components: [
    { tag: "img", name: "icon",
      style: "width: 50px; height: 50px; float: left; padding-right: 10px" },
    { tag: "b", name: "handle" },
    { tag: "span", name: "text" }
  ],

  create: function() {
    this.inherited(arguments);
    this.iconChanged();
    this.handleChanged();
    this.textChanged();
  },

  iconChanged: function() {
    this.$.icon.setAttribute("src", this.icon);
  },

  handleChanged: function() {
    this.$.handle.setContent(this.handle + ": ");
  },

  textChanged: function() {
    this.$.text.setContent(this.text);
  }
});


enyo.kind({
  name: "TwitterSearchApp",
  kind: enyo.Control,
  style: "padding: 40px 40px 40px 40px",
  components: [
    { tag: "input", name: "searchTerm" },
    { tag: "button", content: "Search From Twitter.com", ontap: "search" },
    { tag: "div", name: "tweetList" }
  ],

  addTweet: function(inResult) {
    this.createComponent({
      kind: Tweet,
      container: this.$.tweetList,
      icon: inResult.profile_image_url,
      handle: inResult.from_user,
      text: inResult.text
    });
  },

  search: function() {
    var searchTerm = this.$.searchTerm.hasNode().value;
    var request = new enyo.JsonpRequest({
        url: "http://search.twitter.com/search.json",
        callbackName: "callback"
      });

    request.response(enyo.bind(this, "processSearchResults"));
    request.go({ q: searchTerm });
  },

  processSearchResults: function(inRequest, inResponse) {
    if (!inResponse) return;
    this.$.tweetList.destroyClientControls();
    enyo.forEach(inResponse.results, this.addTweet, this);
    this.$.tweetList.render();
  }
});