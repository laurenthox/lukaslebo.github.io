# JS fundamentals

What is the difference between the equality(==) and the identity(===) operator?? Give some examples where differences can be appreciate. 

In order to access a property in an object we have two possible options. What are they? When should you use one and when the other?

What is a callback function? Possible scenarios to be used?

What does this snippet print to the console?

```javascript
for (var i = 0; i < 5; i++) {
  var btn = document.querySelector('#button');
  btn.addEventListener('click', function(){ console.log(i); }); // async event
}
```

What does this print to the console?? How can we make both print the same?
```javascript
var hero = {
    _name: 'John Doe',
    getSecretIdentity: function (){
        return this._name;
    }
};

var stoleSecretIdentity = hero.getSecretIdentity;

console.log(stoleSecretIdentity());
console.log(hero.getSecretIdentity());
```

What is context in JS? And how can we force the invocation of a function with a particular context? 

JS implements a delegation paradigm when talking about 'inheritance'. Try to explain it with your words.

Proto and prototype questions 


