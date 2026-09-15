import { localeString } from './objects/localeString'
import { localeText } from './objects/localeText'
import { venue } from './objects/venue'
import { contacts } from './objects/contacts'

import { event } from './documents/event'
import { settings } from './documents/settings'
import { video } from './documents/video'
import { galleryItem } from './documents/galleryItem'
import { service } from './documents/service'
import { testimonial } from './documents/testimonial'

export const schemaTypes = [
  // Object types
  localeString,
  localeText,
  venue,
  contacts,

  // Document types
  event,
  settings,
  video,
  galleryItem,
  service,
  testimonial,
]
