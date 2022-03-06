import React from 'react'
 import { useFocusEffect } from '@react-navigation/native'
 
 export function useRefreshOnFocus<T>(refetch: () => void) {
   const enabledRef = React.useRef(false)
 
   useFocusEffect(
     React.useCallback(() => {
       if (enabledRef.current) {
         refetch()
       } else {
         enabledRef.current = true
       }
     }, [])
   )
 }