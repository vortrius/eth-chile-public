export const addTx = (tx: string, action: string): { [key: string]: string } => {
  const _pendingTsx = localStorage.getItem('pendingTxs')
  const newPendingTsx = { ...(_pendingTsx ? JSON.parse(_pendingTsx) : {}), [action]: tx }
  localStorage.setItem('pendingTxs', JSON.stringify(newPendingTsx))
  return newPendingTsx
}

export const removeTx = (id: string): { [key: string]: string } => {
  const _pendingTsx = localStorage.getItem('pendingTxs')
  const newPendingTsx = _pendingTsx ? JSON.parse(_pendingTsx) : {}
  delete newPendingTsx[id]
  localStorage.setItem('pendingTxs', JSON.stringify(newPendingTsx))
  return newPendingTsx
}

export const clearPendingTxs = (): void => {
  const _pendingTsx = localStorage.getItem('pendingTxs')
  const newPendingTsx = _pendingTsx ? JSON.parse(_pendingTsx) : {}
  localStorage.setItem('pendingTxs', JSON.stringify(newPendingTsx['v'] ? { v: newPendingTsx['v'] } : {}))
}

export const getPendingTxs = (): { [key: string]: string } => {
  const pendingTsx = localStorage.getItem('pendingTxs')
  return pendingTsx ? JSON.parse(pendingTsx) : {}
}
