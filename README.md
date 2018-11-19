# Obey The Coin

A simple coin flip cli, because make choices can be difficult:
- Heads = **yes**
- Tails = **no**

Never be indecisive again™

## Install

```
$ npm install -g otc
```

## Example usage
![otc flip](/assets/example1.png "otc flip coin default")
```
$ otc
```
Flips a coin 1 time, by default. 

### Options
![otc flip](/assets/example2.png "otc flip coin 1000 times")
```
$ otc times [num]
```
Don't trust just one flip? No problem. Specify how many `num` times you want that bad boy to be spin - up to a max of `1,000,000`. 

![otc flip](/assets/example3.png "otc flip coin tie breaker")

In the case of a tie, `otc` will flip once more to break it.

### Todo:

- [x] Animation
- [ ] Tests
- [ ] Result Logs
- [ ] Themes
- [ ] Better Animation
- [ ] Improve code (kinda a persistent tasks amirite?)