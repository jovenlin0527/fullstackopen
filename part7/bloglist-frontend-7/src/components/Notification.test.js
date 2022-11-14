import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { act } from 'react-dom/test-utils'

import { notify } from '../reducers/notificationReducer'
import { setupStore } from '../store'
import { NotificationCenter } from './Notification'

import { renderWithProviders } from '../utils/test_utils'

let dispatch

beforeEach(() => {
  const store = setupStore()
  dispatch = store.dispatch.bind(store)
  act(() => {
    renderWithProviders(<NotificationCenter notifications={[]} />, { store })
  })
})

describe('Display dispatched notifications', () => {
  test('display one notification', () => {
    expect(screen.queryByTestId('notificationItem')).toBeNull()
    expect(screen.queryByText('hi')).toBeNull()

    act(() => {
      dispatch(notify('hi'))
    })

    const res = screen.queryAllByTestId('notificationItem')
    expect(res.length).toBe(1)
    expect(screen.queryByText('hi')).not.toBeNull()
  })

  test('display many notifications', () => {
    expect(screen.queryByTestId('notificationItem')).toBeNull()

    act(() => {
      dispatch(notify('hello'))
      dispatch(notify('world'))
    })

    const res = screen.queryAllByTestId('notificationItem')
    expect(res.length).toBe(2)
    expect(screen.queryByText('hello')).not.toBeNull()
    expect(screen.queryByText('world')).not.toBeNull()
  })

  test('Displayed errors should disappear shortly', () => {
    jest.useFakeTimers()
    expect(screen.queryByText('hi')).toBeNull()

    act(() => {
      dispatch(notify('hi'))
    })

    expect(screen.queryByText('hi')).not.toBeNull()
    act(() => {
      jest.runAllTimers()
    })
    expect(screen.queryByText('hi')).toBeNull()
  })
})

