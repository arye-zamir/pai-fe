export type TChatMessage = {
  id: string
  direction: 'incoming' | 'outgoing'
  incoming: boolean
  from: string
  initials: string
  text: string
  entityType: string
  created: string
}
