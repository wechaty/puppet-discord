/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
import path from 'path'

import * as PUPPET  from 'wechaty-puppet'
import { FileBox }  from 'file-box'

import {
  CHATIE_OFFICIAL_ACCOUNT_QRCODE,
  qrCodeForChatie,
  VERSION,
  NAME,
  log,
}                                   from './config.js'

// import { Attachment } from './mock/user/types'

import {
  Mocker,
  // ContactMock,
}                     from './mock/mod.js'

export type PuppetDiscordOptions = PUPPET.PuppetOptions & {
  mocker?: Mocker,
}

class PuppetDiscord extends PUPPET.Puppet {

  static override readonly VERSION = VERSION

  private loopTimer?: ReturnType<typeof setTimeout>

  mocker: Mocker

  constructor (
    public override options: PuppetDiscordOptions = {},
  ) {
    super(options)
    log.verbose('PuppetDiscord', 'constructor()')

    if (options.mocker) {
      log.verbose('PuppetDiscord', 'constructor() use options.mocker')
      this.mocker = options.mocker
    } else {
      log.verbose('PuppetDiscord', 'constructor() creating the default mocker')
      this.mocker = new Mocker()
      // this.mocker.use(SimpleBehavior())
    }
    this.mocker.puppet = this
  }

  override name ()    { return `${NAME}<${super.name()}>` }
  override version () { return `${VERSION}<${super.version()}>` }

  override async onStart (): Promise<void> {
    log.verbose('PuppetDiscord', 'onStart()')

    /**
     * Start mocker after the puppet fully turned ON.
     */
    setImmediate(() => this.mocker.start())
  }

  override async onStop (): Promise<void> {
    log.verbose('PuppetDiscord', 'onStop()')

    if (this.loopTimer) {
      clearInterval(this.loopTimer)
    }

    this.mocker.stop()
  }

  override ding (data?: string): void {
    log.silly('PuppetDiscord', 'ding(%s)', data || '')
    setTimeout(() => this.emit('dong', { data: data || '' }), 1000)
  }

  /**
   *
   * ContactSelf
   *
   *
   */
  override async contactSelfQRCode (): Promise<string> {
    log.verbose('PuppetDiscord', 'contactSelfQRCode()')
    return CHATIE_OFFICIAL_ACCOUNT_QRCODE
  }

  override async contactSelfName (name: string): Promise<void> {
    log.verbose('PuppetDiscord', 'contactSelfName(%s)', name)
  }

  override async contactSelfSignature (signature: string): Promise<void> {
    log.verbose('PuppetDiscord', 'contactSelfSignature(%s)', signature)
  }

  /**
   *
   * Contact
   *
   */
  override contactAlias (contactId: string)                      : Promise<string>
  override contactAlias (contactId: string, alias: string | null): Promise<void>

  override async contactAlias (contactId: string, alias?: string | null): Promise<void | string> {
    log.verbose('PuppetDiscord', 'contactAlias(%s, %s)', contactId, alias)

    if (typeof alias === 'undefined') {
      return 'mock alias'
    }
  }

  override async contactPhone (contactId: string): Promise<string[]>
  override async contactPhone (contactId: string, phoneList: string[]): Promise<void>

  override async contactPhone (contactId: string, phoneList?: string[]): Promise<string[] | void> {
    log.verbose('PuppetDiscord', 'contactPhone(%s, %s)', contactId, phoneList)
    if (typeof phoneList === 'undefined') {
      return []
    }
  }

  override async contactCorporationRemark (contactId: string, corporationRemark: string) {
    log.verbose('PuppetDiscord', 'contactCorporationRemark(%s, %s)', contactId, corporationRemark)
  }

  override async contactDescription (contactId: string, description: string) {
    log.verbose('PuppetDiscord', 'contactDescription(%s, %s)', contactId, description)
  }

  override async contactList (): Promise<string[]> {
    log.verbose('PuppetDiscord', 'contactList()')
    return [...this.mocker.cacheContactPayload.keys()]
  }

  override async contactAvatar (contactId: string)                : Promise<FileBox>
  override async contactAvatar (contactId: string, file: FileBox) : Promise<void>

  override async contactAvatar (contactId: string, file?: FileBox): Promise<void | FileBox> {
    log.verbose('PuppetDiscord', 'contactAvatar(%s)', contactId)

    /**
     * 1. set
     */
    if (file) {
      return
    }

    /**
     * 2. get
     */
    const WECHATY_ICON_PNG = path.resolve('../../docs/images/wechaty-icon.png')
    return FileBox.fromFile(WECHATY_ICON_PNG)
  }

  override async contactRawPayloadParser (payload: PUPPET.payloads.Contact) { return payload }
  override async contactRawPayload (id: string): Promise<PUPPET.payloads.Contact> {
    log.verbose('PuppetDiscord', 'contactRawPayload(%s)', id)
    return this.mocker.contactPayload(id)
  }

  /**
   *
   * Conversation
   *
   */
  override async conversationReadMark (conversationId: string, hasRead?: boolean) : Promise<void> {
    log.verbose('PuppetService', 'conversationRead(%s, %s)', conversationId, hasRead)
  }

  /**
   *
   * Message
   *
   */
  override async messageContact (
    messageId: string,
  ): Promise<string> {
    log.verbose('PuppetDiscord', 'messageContact(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof ContactMock) {
    //   return attachment.id
    // }
    return ''
  }

  override async messageImage (
    messageId: string,
    imageType: PUPPET.types.Image,
  ) : Promise<FileBox> {
    log.verbose('PuppetDiscord', 'messageImage(%s, %s[%s])',
      messageId,
      imageType,
      PUPPET.types.Image[imageType],
    )
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof FileBox) {
    //   return attachment
    // }
    return FileBox.fromQRCode('fake-qrcode')
  }

  override async messageRecall (
    messageId: string,
  ): Promise<boolean> {
    log.verbose('PuppetDiscord', 'messageRecall(%s)', messageId)
    return false
  }

  override async messageFile (id: string): Promise<FileBox> {
    // const attachment = this.mocker.MockMessage.loadAttachment(id)
    // if (attachment instanceof FileBox) {
    //   return attachment
    // }
    return FileBox.fromBase64(
      'cRH9qeL3XyVnaXJkppBuH20tf5JlcG9uFX1lL2IvdHRRRS9kMMQxOPLKNYIzQQ==',
      'mock-file' + id + '.txt',
    )
  }

  override async messageUrl (messageId: string)  : Promise<PUPPET.payloads.UrlLink> {
    log.verbose('PuppetDiscord', 'messageUrl(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof UrlLink) {
    //   return attachment.payload
    // }
    return {
      title : 'mock title for ' + messageId,
      url   : 'https://mock.url',
    }
  }

  override async messageLocation (messageId: string): Promise<PUPPET.payloads.Location> {
    log.verbose('PuppetDiscord', 'messageLocation(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof MiniProgram) {
    //   return attachment.payload
    // }
    return {
      accuracy  : 15,
      address   : '???????????????????????????45 Chengfu Rd',
      latitude  : 39.995120999999997,
      longitude : 116.334154,
      name      : '?????????????????????(??????????????????45???)',
    }
  }

  override async messageMiniProgram (messageId: string): Promise<PUPPET.payloads.MiniProgram> {
    log.verbose('PuppetDiscord', 'messageMiniProgram(%s)', messageId)
    // const attachment = this.mocker.MockMessage.loadAttachment(messageId)
    // if (attachment instanceof MiniProgram) {
    //   return attachment.payload
    // }
    return {
      title : 'mock title for ' + messageId,
    }
  }

  override async messageRawPayloadParser (payload: PUPPET.payloads.Message) { return payload }
  override async messageRawPayload (id: string): Promise<PUPPET.payloads.Message> {
    log.verbose('PuppetDiscord', 'messageRawPayload(%s)', id)
    return this.mocker.messagePayload(id)
  }

  async #messageSend (
    conversationId: string,
    something: string | FileBox, // | Attachment
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'messageSend(%s, %s)', conversationId, something)
    if (!this.isLoggedIn) {
      throw new Error('not logged in')
    }

    const user = this.mocker.ContactMock.load(this.currentUserId)
    let conversation

    if (/@/.test(conversationId)) {
      // FIXME: extend a new puppet method messageRoomSendText, etc, for Room message?
      conversation = this.mocker.RoomMock.load(conversationId)
    } else {
      conversation = this.mocker.ContactMock.load(conversationId)
    }
    user.say(something).to(conversation)
  }

  override async messageSendText (
    conversationId: string,
    text     : string,
  ): Promise<void> {
    return this.#messageSend(conversationId, text)
  }

  override async messageSendFile (
    conversationId: string,
    file     : FileBox,
  ): Promise<void> {
    return this.#messageSend(conversationId, file)
  }

  override async messageSendContact (
    conversationId: string,
    contactId : string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'messageSendUrl(%s, %s)', conversationId, contactId)

    // const contact = this.mocker.MockContact.load(contactId)
    // return this.messageSend(conversationId, contact)
  }

  override async messageSendUrl (
    conversationId: string,
    urlLinkPayload: PUPPET.payloads.UrlLink,
  ) : Promise<void> {
    log.verbose('PuppetDiscord', 'messageSendUrl(%s, %s)', conversationId, JSON.stringify(urlLinkPayload))

    // const url = new UrlLink(urlLinkPayload)
    // return this.messageSend(conversationId, url)
  }

  override async messageSendLocation (
    conversationId: string,
    locationPayload: PUPPET.payloads.Location,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'messageSendLocation(%s, %s)', conversationId, JSON.stringify(locationPayload))

    // const location = new Location(locationPayload)
    // return this.messageSend(conversationId, location)
  }

  override async messageSendMiniProgram (
    conversationId: string,
    miniProgramPayload: PUPPET.payloads.MiniProgram,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'messageSendMiniProgram(%s, %s)', conversationId, JSON.stringify(miniProgramPayload))
    // const miniProgram = new MiniProgram(miniProgramPayload)
    // return this.messageSend(conversationId, miniProgram)
  }

  override async messageForward (
    conversationId: string,
    messageId : string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'messageForward(%s, %s)',
      conversationId,
      messageId,
    )
  }

  /**
   *
   * Room
   *
   */
  override async roomRawPayloadParser (payload: PUPPET.payloads.Room) { return payload }
  override async roomRawPayload (id: string): Promise<PUPPET.payloads.Room> {
    log.verbose('PuppetDiscord', 'roomRawPayload(%s)', id)
    return this.mocker.roomPayload(id)
  }

  override async roomList (): Promise<string[]> {
    log.verbose('PuppetDiscord', 'roomList()')
    return [...this.mocker.cacheRoomPayload.keys()]
  }

  override async roomDel (
    roomId    : string,
    contactId : string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'roomDel(%s, %s)', roomId, contactId)
  }

  override async roomAvatar (roomId: string): Promise<FileBox> {
    log.verbose('PuppetDiscord', 'roomAvatar(%s)', roomId)

    const payload = await this.roomPayload(roomId)

    if (payload.avatar) {
      return FileBox.fromUrl(payload.avatar)
    }
    log.warn('PuppetDiscord', 'roomAvatar() avatar not found, use the chatie default.')
    return qrCodeForChatie()
  }

  override async roomAdd (
    roomId    : string,
    contactId : string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'roomAdd(%s, %s)', roomId, contactId)
  }

  override async roomTopic (roomId: string)                : Promise<string>
  override async roomTopic (roomId: string, topic: string) : Promise<void>

  override async roomTopic (
    roomId: string,
    topic?: string,
  ): Promise<void | string> {
    log.verbose('PuppetDiscord', 'roomTopic(%s, %s)', roomId, topic)

    if (typeof topic === 'undefined') {
      return 'mock room topic'
    }

    await this.dirtyPayload(PUPPET.types.Payload.Room, roomId)
  }

  override async roomCreate (
    contactIdList : string[],
    topic         : string,
  ): Promise<string> {
    log.verbose('PuppetDiscord', 'roomCreate(%s, %s)', contactIdList, topic)

    return 'mock_room_id'
  }

  override async roomQuit (roomId: string): Promise<void> {
    log.verbose('PuppetDiscord', 'roomQuit(%s)', roomId)
  }

  override async roomQRCode (roomId: string): Promise<string> {
    log.verbose('PuppetDiscord', 'roomQRCode(%s)', roomId)
    return roomId + ' mock qrcode'
  }

  override async roomMemberList (roomId: string) : Promise<string[]> {
    log.verbose('PuppetDiscord', 'roomMemberList(%s)', roomId)
    return []
  }

  override async roomMemberRawPayload (roomId: string, contactId: string): Promise<PUPPET.payloads.RoomMember>  {
    log.verbose('PuppetDiscord', 'roomMemberRawPayload(%s, %s)', roomId, contactId)
    return {
      avatar    : 'mock-avatar-data',
      id        : 'xx',
      name      : 'mock-name',
      roomAlias : 'yy',
    }
  }

  override async roomMemberRawPayloadParser (rawPayload: PUPPET.payloads.RoomMember): Promise<PUPPET.payloads.RoomMember>  {
    log.verbose('PuppetDiscord', 'roomMemberRawPayloadParser(%s)', rawPayload)
    return rawPayload
  }

  override async roomAnnounce (roomId: string)                : Promise<string>
  override async roomAnnounce (roomId: string, text: string)  : Promise<void>

  override async roomAnnounce (roomId: string, text?: string) : Promise<void | string> {
    if (text) {
      return
    }
    return 'mock announcement for ' + roomId
  }

  /**
   *
   * Room Invitation
   *
   */
  override async roomInvitationAccept (roomInvitationId: string): Promise<void> {
    log.verbose('PuppetDiscord', 'roomInvitationAccept(%s)', roomInvitationId)
  }

  override async roomInvitationRawPayload (roomInvitationId: string): Promise<any> {
    log.verbose('PuppetDiscord', 'roomInvitationRawPayload(%s)', roomInvitationId)
  }

  override async roomInvitationRawPayloadParser (rawPayload: any): Promise<PUPPET.payloads.RoomInvitation> {
    log.verbose('PuppetDiscord', 'roomInvitationRawPayloadParser(%s)', JSON.stringify(rawPayload))
    return rawPayload
  }

  /**
   *
   * Friendship
   *
   */
  override async friendshipRawPayload (id: string): Promise<any> {
    return { id } as any
  }

  override async friendshipRawPayloadParser (rawPayload: any): Promise<PUPPET.payloads.Friendship> {
    return rawPayload
  }

  override async friendshipSearchPhone (
    phone: string,
  ): Promise<null | string> {
    log.verbose('PuppetDiscord', 'friendshipSearchPhone(%s)', phone)
    return null
  }

  override async friendshipSearchWeixin (
    weixin: string,
  ): Promise<null | string> {
    log.verbose('PuppetDiscord', 'friendshipSearchWeixin(%s)', weixin)
    return null
  }

  override async friendshipAdd (
    contactId : string,
    hello     : string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'friendshipAdd(%s, %s)', contactId, hello)
  }

  override async friendshipAccept (
    friendshipId : string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'friendshipAccept(%s)', friendshipId)
  }

  /**
   *
   * Tag
   *
   */
  override async tagContactAdd (
    tagId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'tagContactAdd(%s)', tagId, contactId)
  }

  override async tagContactRemove (
    tagId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'tagContactRemove(%s)', tagId, contactId)
  }

  override async tagContactDelete (
    tagId: string,
  ): Promise<void> {
    log.verbose('PuppetDiscord', 'tagContactDelete(%s)', tagId)
  }

  override async tagContactList (
    contactId?: string,
  ): Promise<string[]> {
    log.verbose('PuppetDiscord', 'tagContactList(%s)', contactId)
    return []
  }

}

export { PuppetDiscord }
export default PuppetDiscord
