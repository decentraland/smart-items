import { WearablesChecker, WearablesCheckerSystem } from './area'
import { getUserData } from '@decentraland/Identity'

export type Props = {
  collection?: string
  category?: string
  wearable?: string
  onEnter?: Actions
  onPass?: Actions
  onReject?: Actions
  text?: string
  fontSize?: number
  enabled: boolean
}

export enum wearableCategories {
  'hat',
  'helmet',
  'top_head',
  'earring',
  'eyewear',
  'facial_hair',
  'hair',
  'tiara',
  'mask',
}

type ChangeTextType = { newText: string }

export default class Button implements IScript<Props> {
  hasData: boolean = false
  playerData: string[] = []
  wearablesIndex = []
  wearablesByFullName: string[] = []
  thumbnail: string
  userId: string
  init() {
    engine.addSystem(new WearablesCheckerSystem())
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const trigger = new WearablesChecker()
    trigger.enabled = props.enabled

    const tile = new Entity(host.name + '-tile')
    tile.setParent(host)

    const animator = new Animator()
    const scanClip = new AnimationState('Laser_Action', {
      looping: false,
    })
    const allowClip = new AnimationState('Allow_Action', {
      looping: false,
    })
    const rejectClip = new AnimationState('NotAllow_Action', {
      looping: false,
    })
    animator.addClip(scanClip)
    animator.addClip(allowClip)
    animator.addClip(rejectClip)

    tile.addComponent(animator)

    tile.addComponent(new GLTFShape('models/Wearable-Reader.glb'))

    this.fetchData(props)

    // custom line of text
    let signText = new Entity()
    signText.setParent(host)
    let text = new TextShape(props.text)
    text.fontSize = props.fontSize
    text.color = Color3.FromHexString('#8cfdff')
    text.outlineWidth = 0.4
    text.outlineColor = Color3.FromHexString('#8cfdff')

    text.width = 20
    text.height = 10
    text.hTextAlign = 'center'

    signText.addComponent(text)

    signText.addComponent(
      new Transform({
        position: new Vector3(0, 0.8, 0.035),
        rotation: Quaternion.Euler(0, 90, 0),
        scale: new Vector3(0.1, 0.1, 0.1),
      })
    )

    let thumbTexture = new Texture(this.thumbnail)
    let thumbMaterial = new Material()
    thumbMaterial.albedoTexture = thumbTexture

    let thumbPlane = new Entity()
    thumbPlane.setParent(host)
    thumbPlane.addComponent(new PlaneShape())
    thumbPlane.addComponent(thumbMaterial)
    thumbPlane.addComponent(
      new Transform({
        position: new Vector3(0, 0.355, 0.01),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.72, 0.72, 0.72),
      })
    )

    channel.handleAction('enable', () => {
      trigger.enabled = true
    })

    channel.handleAction('disable', () => {
      trigger.enabled = false
    })

    trigger.onEnter = async function () {
      if (trigger.enabled) {
        scanClip.stop()
        scanClip.play()
        channel.sendActions(props.onEnter)
        if (!this.hasData) {
          await this.fetchData(props)
        }

        if (await this.check(this.playerData, props)) {
          allowClip.stop()
          allowClip.play()
          channel.sendActions(props.onPass)
          log('PASSED')
        } else {
          rejectClip.stop()
          rejectClip.play()
          channel.sendActions(props.onReject)
          log('REJECTED')
        }
      }
    }

    channel.handleAction<ChangeTextType>('changeText', (action) => {
      text.value = action.newText
    })

    channel.request<string>('getText', (signText) => (text.value = signText))
    channel.reply<string>('getText', () => text.value)

    // sync initial values
    channel.request<boolean>('enabled', (enabled) => {
      trigger.enabled = enabled
    })
    channel.reply<boolean>('enabled', () => trigger.enabled)

    host.addComponent(trigger)
  }

  async fetchData(props: Props) {
    if (!this.userId) {
      this.userId = await this.getUser()
    }
    let url = `https://peer.decentraland.org/content/entities/profiles?pointer={this.userIdData.userId}`.toString()
    log('using URL: ', url)
    //`https://peer.decentraland.org/content/entities/profiles?pointer=0xe2b6024873d218B2E83B462D3658D8D7C3f55a18`
    //let result: String[] = []

    try {
      let response = await fetch(url)
      let json = await response.json()
      log('sent request to API ')
      log(json)

      this.playerData = json[0].metadata.avatars[0].avatar.wearables
    } catch (e) {
      log('failed to reach URL', e.message)
    }
    if (props.wearable || props.category) {
      try {
        let response = await fetch(
          `https://dcl-wearables-dev.now.sh/expected.json`
        )
        let json = await response.json()
        this.wearablesIndex = json
        log(this.wearablesIndex)
      } catch (e) {
        log('error connecting to wearables server', e.message)
      }

      if (props.wearable) {
        let wearablesList: string[] = props.wearable.split(',')
        for (let listedWearable of wearablesList) {
          for (let wearableOfDB of this.wearablesIndex) {
            for (let nameInLanguage of wearableOfDB.i18n) {
              if (nameInLanguage.text == listedWearable.trim()) {
                //// ADD TO LIST
                this.wearablesByFullName.push(wearableOfDB.id)
                this.thumbnail =
                  'https://content.decentraland.org/contents/' +
                  wearableOfDB.thumbnail
              }
            }
          }
        }
        log('full names of searched wearables: ', this.wearablesByFullName)
      } else if (props.category) {
        log('looking for only ', props.category)
        for (let wearableOfDB of this.wearablesIndex) {
          if (wearableOfDB.category == props.category.toString()) {
            //// ADD TO LIST
            this.wearablesByFullName.push(wearableOfDB.id)
          }
        }
        log('full names of searched wearables: ', this.wearablesByFullName)
      }
    }
    this.hasData = true
  }

  check(playerWearablesArray: String[], props: Props): boolean {
    let result: boolean = false
    log('player wearables array: ', playerWearablesArray)
    if (this.wearablesByFullName) {
      for (let listedWearable of this.wearablesByFullName) {
        for (let playerWearable of playerWearablesArray) {
          if (playerWearable == listedWearable) {
            result = true
            log('FOUND A MATCH')
          }
        }
      }
    } else if (props.category) {
      for (let playerWearable of playerWearablesArray) {
        for (let dbWearable of this.wearablesIndex) {
          if (playerWearable == dbWearable.id) {
            log('FOUND MATCH')
            if (dbWearable.category == props.category.toString()) {
              result = true
            }
          }
        }
      }
    } else if (props.collection) {
      let stringEndIndex = props.collection.toString().length
      for (let item of playerWearablesArray) {
        if (item.substring(0, stringEndIndex) == props.collection.toString()) {
          result = true
          log('FOUND A MATCH')
        } else {
          log(
            'not the same: ',
            item.substring(0, stringEndIndex),
            ' ',
            props.collection
          )
        }
      }
    }
    return result
  }

  getUser(): Promise<string> {
    return new Promise((resolve, reject) => {
      const randomId = Math.floor(Math.random() * 500)

      executeTask(async () => {
        try {
          let id = await getUserData()
          return id.userId
        } catch {
          log('failed to reach user ID')

          return randomId
        }
      })
    })
  }
}
