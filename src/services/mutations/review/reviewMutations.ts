import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  submitReview,
  editReview,
  formatReviewApiError,
  type ReviewPayload,
} from "@/api/reviews/reviewApi"
import { reviewKeys } from "@/lib/queryKeys"

export function useSubmitReview() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ propertyId, payload }: { propertyId: string; payload: ReviewPayload }) => {
      try {
        await submitReview(propertyId, payload)
      } catch (err) {
        throw new Error(formatReviewApiError(err, "Failed to submit review"))
      }
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(vars.propertyId) })
    },
  })

  const submit = async (propertyId: string, payload: ReviewPayload): Promise<boolean> => {
    try {
      await mutation.mutateAsync({ propertyId, payload })
      return true
    } catch {
      return false
    }
  }

  return {
    submitReview: submit,
    isSubmitting: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
  }
}

export function useEditReview() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: async ({ propertyId, reviewId, payload }: { propertyId: string; reviewId: string; payload: ReviewPayload }) => {
      try {
        await editReview(propertyId, reviewId, payload)
      } catch (err) {
        throw new Error(formatReviewApiError(err, "Failed to update review"))
      }
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: reviewKeys.detail(vars.propertyId) })
    },
  })

  const edit = async (propertyId: string, reviewId: string, payload: ReviewPayload): Promise<boolean> => {
    try {
      await mutation.mutateAsync({ propertyId, reviewId, payload })
      return true
    } catch {
      return false
    }
  }

  return {
    editReview: edit,
    isEditing: mutation.isPending,
    error: mutation.error ? mutation.error.message : null,
  }
}
