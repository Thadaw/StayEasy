import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSpecialOffers, deleteSpecialOffer, updateSpecialOffer } from '@/api/pms/pmsApi'
import { specialOfferKeys } from '@/lib/queryKeys'
import type { SpecialOfferPayload, SpecialOfferUpdatePayload } from '@/types/pms'

function invalidateSpecialOffers(queryClient: ReturnType<typeof useQueryClient>, propertyId: string | null | undefined) {
  queryClient.invalidateQueries({ queryKey: specialOfferKeys.byProperty(propertyId || '') })
  queryClient.invalidateQueries({ queryKey: specialOfferKeys.all })
}

interface UseCreateSpecialOffersReturn {
  createSpecialOffers: (offers: SpecialOfferPayload[]) => Promise<unknown>
  isCreating: boolean
  error: unknown
}

export function useCreateSpecialOffers(propertyId: string | null | undefined): UseCreateSpecialOffersReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (offers: SpecialOfferPayload[]) => {
      if (!propertyId) throw new Error('No property selected')
      return createSpecialOffers(propertyId, offers)
    },
    onSuccess: () => invalidateSpecialOffers(queryClient, propertyId),
  })

  return {
    createSpecialOffers: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error,
  }
}

interface UseUpdateSpecialOfferReturn {
  updateSpecialOffer: (offerId: string, payload: SpecialOfferUpdatePayload) => Promise<unknown>
  isUpdating: boolean
  error: unknown
}

export function useUpdateSpecialOffer(propertyId: string | null | undefined): UseUpdateSpecialOfferReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ offerId, payload }: { offerId: string; payload: SpecialOfferUpdatePayload }) => {
      if (!propertyId) throw new Error('No property selected')
      return updateSpecialOffer(propertyId, offerId, payload)
    },
    onSuccess: () => invalidateSpecialOffers(queryClient, propertyId),
  })

  return {
    updateSpecialOffer: (offerId, payload) => mutation.mutateAsync({ offerId, payload }),
    isUpdating: mutation.isPending,
    error: mutation.error,
  }
}

interface UseDeleteSpecialOfferReturn {
  deleteSpecialOffer: (offerId: string) => Promise<void>
  isDeleting: boolean
  error: unknown
}

export function useDeleteSpecialOffer(propertyId: string | null | undefined): UseDeleteSpecialOfferReturn {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (offerId: string) => {
      if (!propertyId) throw new Error('No property selected')
      return deleteSpecialOffer(propertyId, offerId)
    },
    onSuccess: () => invalidateSpecialOffers(queryClient, propertyId),
  })

  return {
    deleteSpecialOffer: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    error: mutation.error,
  }
}
