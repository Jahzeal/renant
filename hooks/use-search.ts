"use client"

import { useState } from "react"

export interface SearchFilters {
  keywords: string
  selectedPets: string[]
  moveInDate: string
}

export const useSearch = (initialFilters?: Partial<SearchFilters>) => {
  const [keywords, setKeywords] = useState(initialFilters?.keywords ?? "")
  const [selectedPets, setSelectedPets] = useState<string[]>(initialFilters?.selectedPets ?? [])
  const [moveInDate, setMoveInDate] = useState(initialFilters?.moveInDate ?? "")

  const handlePetToggle = (petId: string) => {
    setSelectedPets((prev) => (prev.includes(petId) ? prev.filter((id) => id !== petId) : [...prev, petId]))
  }

  const setKeywordsValue = (value: string) => {
    setKeywords(value)
  }

  const setMoveInDateValue = (value: string) => {
    setMoveInDate(value)
  }

  const resetFilters = () => {
    setKeywords("")
    setSelectedPets([])
    setMoveInDate("")
  }

  const getFilters = () => ({
    keywords,
    selectedPets,
    moveInDate,
  })

  return {
    keywords,
    setKeywords: setKeywordsValue,
    selectedPets,
    handlePetToggle,
    moveInDate,
    setMoveInDate: setMoveInDateValue,
    resetFilters,
    getFilters,
  }
}
