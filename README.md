# Obey The Coin

A simple coin flip cli, because making choices can be difficult:
- Heads = **yes**
- Tails = **no**

Never be indecisive again™

## Install

```
$ npm install -g obey-the-coin
```

## Example usage
![otc flip](/assets/example1.png "otc flip coin default")
```
$ otc
```
Flips a coin 1 time, by default.

### Options

#### times [num | -n]
![otc flip](/assets/example2.png "otc flip coin 1000 times")
```
$ otc times [num]
```
Don't trust just one flip? No problem. Specify how many `num` times you want that bad boy to be spin - up to a max of `1,000,000`.

![otc flip](/assets/example3.png "otc flip coin tie breaker")

In the case of a tie, `otc` will flip once more to break it.

#### stats [delete | -D]
![otc flip](/assets/example4.png "otc flip coin total stats")
```
$ otc stats
```
See how many times you've have to say `yes`, `no`, or your total `flip count`. To delete all logged stats, throw the `-D` or `-delete` flag.

### Todo:

- [x] Animation
- [x] Result Logs
- [ ] Tests
- [ ] Themes
- [ ] Better Animation
- [ ] Improve code (kinda a persistent tasks amirite?)
