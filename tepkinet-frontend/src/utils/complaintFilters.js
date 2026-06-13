export function filterComplaintsByStatus(complaints, status) {
  if (!status) {
    return complaints
  }

  return complaints.filter((complaint) => complaint.status === status)
}

export function filterComplaintsBySearch(complaints, keyword) {
  if (!keyword) {
    return complaints
  }

  const normalized = keyword.toLowerCase()

  return complaints.filter((complaint) => {
    const title = (complaint.title ?? '').toLowerCase()
    const content = (complaint.content ?? '').toLowerCase()

    return title.includes(normalized) || content.includes(normalized)
  })
}

export function filterCompanyComplaintsBySearch(complaints, keyword) {
  if (!keyword) {
    return complaints
  }

  const normalized = keyword.toLowerCase()

  return complaints.filter((complaint) => {
    const title = (complaint.title ?? '').toLowerCase()
    const content = (complaint.content ?? '').toLowerCase()
    const username = (complaint.username ?? '').toLowerCase()

    return (
      title.includes(normalized) ||
      content.includes(normalized) ||
      username.includes(normalized))
  })
}

export function filterComplaintsByCompany(complaints, companyName) {
  if (!companyName) {
    return complaints
  }

  return complaints.filter((complaint) => complaint.companyName === companyName)
}


export function applyClientComplaintFilters(
  complaints,
  { companyName },
) {
  return filterComplaintsByCompany(
    complaints,
    companyName,
  )
}

export function sortComplaints(complaints, sortBy) {
  const items = [...complaints]

  switch (sortBy) {
    case 'title-asc':
      return items.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    case 'title-desc':
      return items.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''))
    case 'oldest':
      return items.sort(
        (a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime(),
      )
    case 'newest':
    default:
      return items.sort(
        (a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime(),
      )
  }
}

export function paginateComplaints(complaints, page, pageSize) {
  const start = page * pageSize
  return complaints.slice(start, start + pageSize)
}

export function extractCompanyOptions(complaints) {
  const names = new Set()

  complaints.forEach((complaint) => {
    if (complaint.companyName) {
      names.add(complaint.companyName)
    }
  })

  return [...names].sort((a, b) => a.localeCompare(b))
}

