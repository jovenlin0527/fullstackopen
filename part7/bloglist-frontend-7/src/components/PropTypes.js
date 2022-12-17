import PropTypes from 'prop-types'

export const BlogType = PropTypes.exact({
  title: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  user: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired,
})
