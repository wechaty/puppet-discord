# PUPPET-DISCORD

[![NPM Version](https://badge.fury.io/js/wechaty-puppet-discord.svg)](https://badge.fury.io/js/wechaty-puppet-discord)
[![npm (tag)](https://img.shields.io/npm/v/wechaty-puppet-discord/next.svg)](https://www.npmjs.com/package/wechaty-puppet-discord?activeTab=versions)
[![NPM](https://github.com/wechaty/wechaty-puppet-discord/workflows/NPM/badge.svg)](https://github.com/wechaty/wechaty-puppet-discord/actions?query=workflow%3ANPM)
[![ES Modules](https://img.shields.io/badge/ES-Modules-brightgreen)](https://github.com/Chatie/tsconfig/issues/16)

![chatie puppet](https://wechaty.github.io/wechaty-puppet-discord/images/discord.png)

> Picture Credit: <https://softwareautotools.com/2017/03/01/mocking-explained-in-python/>

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

Puppet Mocker & Starter Template for Wechaty, it is very useful when you:

1. Want to test the Wechaty framework with a discord puppet, or
1. You want to write your own Puppet implenmentation.

Then `PuppetDiscord` will helps you a lot.

## UNDER CONSTRUCTION

This module is not useable, please do not try to use it unless you want to join the developer group.

See: Issue [#1](https://github.com/wechaty/puppet-discord/issues/1)

## USAGE

### Puppet Discord

```ts
import { Wechaty }   from 'wechaty'
import { PuppetDiscord } from 'wechaty-puppet-discord'

const puppet  = new PuppetDiscord()
const wechaty = new Wechaty({ puppet })

wechaty.start()
```

## API Reference

TBW

## Resources

- [Creating a Bot Account](https://discordpy.readthedocs.io/en/stable/discord.html)

## HISTORY

### main v0.0.1 (Dec 5, 2021)

Init version for discord

## AUTHOR

[Huan LI](http://linkedin.com/in/zixia) \<zixia@zixia.net\>

<a href="https://stackexchange.com/users/265499">
  <img src="https://stackexchange.com/users/flair/265499.png" width="208" height="58" alt="profile for zixia on Stack Exchange, a network of free, community-driven Q&amp;A sites" title="profile for zixia on Stack Exchange, a network of free, community-driven Q&amp;A sites">
</a>

## COPYRIGHT & LICENSE

- Code & Docs © 2021 Huan LI \<zixia@zixia.net\>
- Code released under the Apache-2.0 License
- Docs released under Creative Commons
