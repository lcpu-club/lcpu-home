export interface Project {
  title: string
  description: string
  image?: string
  imageDark?: string
  link: string
  internal: boolean
  personInCharge: {
    name: string
    username: string
    avatar: string
  }[]
  roadmap: {
    pending: Milestone[]
    done: Milestone[]
  }
}

export interface Milestone {
  content: string

  // use string here and we will display as is. cuz we need
  // some rather inaccurate descriptions...
  time: string
}
