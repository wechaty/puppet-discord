#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { test } from 'tstest'

import { PuppetDiscord } from './puppet-discord.js'

class PuppetDiscordTest extends PuppetDiscord {
}

test('PuppetDiscord perfect restart testing', async t => {
  const puppet = new PuppetDiscordTest()
  try {

    for (let i = 0; i < 3; i++) {
      await puppet.start()
      t.ok(puppet.state.active(), 'should be turned on after start()')

      await puppet.stop()
      t.ok(puppet.state.inactive(), 'should be turned off after stop()')

      t.pass('start/stop-ed at #' + i)
    }

    t.pass('PuppetDiscord() perfect restart pass.')
  } catch (e) {
    t.fail(e as any)
  }
})

test('PuppetDiscord toString()', async t => {
  const puppet = new PuppetDiscordTest()
  const REGEXP = /PuppetDiscord/
  t.doesNotThrow(() => puppet.toString(), 'should not throw')
  t.ok(REGEXP.test(puppet.toString()), 'should be PuppetDiscord')
})
