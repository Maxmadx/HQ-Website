# Social Media Planner

## Overview

The Social Media Planner is a comprehensive content management system for planning, drafting, and publishing social media posts across multiple platforms. It enables teams to collaborate on content from initial idea through final publication, with full visibility into the content pipeline via calendar and kanban views.

---

## Core Concepts

### Post Lifecycle Stages

| Stage | Description | Color |
|-------|-------------|-------|
| **Idea** | Initial concept or topic suggestion | Gray |
| **Drafting** | Content being written/created | Blue |
| **Review** | Awaiting approval from stakeholders | Yellow |
| **Approved** | Ready to be scheduled/published | Green |
| **Scheduled** | Queued for automatic publishing | Purple |
| **Published** | Live on social platform | Teal |
| **Archived** | Completed or discarded posts | Dark Gray |

### Supported Platforms

| Platform | Character Limit | Media Support |
|----------|-----------------|---------------|
| **Instagram** | 2,200 | Images, Videos, Carousels, Reels, Stories |
| **Twitter/X** | 280 | Images, Videos, GIFs |
| **Facebook** | 63,206 | Images, Videos, Links, Stories |
| **LinkedIn** | 3,000 | Images, Videos, Documents, Articles |
| **TikTok** | 2,200 | Videos only |
| **YouTube** | 5,000 (description) | Videos, Shorts |
| **Pinterest** | 500 | Images, Videos |

### Assignment Roles

| Role | Description |
|------|-------------|
| **Ideator** | Person who originated the idea |
| **Creator** | Person responsible for writing/creating content |
| **Reviewer** | Person who approves content before publishing |
| **Publisher** | Person who handles final scheduling/posting |

---

## Data Model

### Post Document

```javascript
{
  id: string,
  createdAt: Timestamp,
  updatedAt: Timestamp,

  // Content
  title: string,                    // Internal reference title
  content: string,                  // Post body text
  contentVariants: [                // Platform-specific versions
    {
      platform: 'instagram' | 'twitter' | 'facebook' | ...,
      content: string,
      characterCount: number
    }
  ],
  hashtags: string[],               // Extracted/suggested hashtags
  mentions: string[],               // @mentions to include

  // Media
  media: [
    {
      id: string,
      type: 'image' | 'video' | 'gif' | 'document',
      url: string,
      thumbnailUrl: string,
      altText: string,
      aspectRatio: string,          // '1:1', '4:5', '16:9', '9:16'
      duration: number | null       // For videos, in seconds
    }
  ],

  // Workflow
  stage: 'idea' | 'drafting' | 'review' | 'approved' | 'scheduled' | 'published' | 'archived',
  priority: 'low' | 'medium' | 'high' | 'urgent',

  // Targeting
  platforms: string[],              // Target platforms for this post
  scheduledFor: Timestamp | null,   // When to publish
  publishedAt: Timestamp | null,    // When actually published

  // Assignments
  ideatorId: string,                // User who created the idea
  ideatorName: string,
  creatorId: string | null,         // Assigned content creator
  creatorName: string | null,
  reviewerId: string | null,        // Assigned reviewer
  reviewerName: string | null,

  // Campaign/Organization
  campaignId: string | null,        // Link to marketing campaign
  tags: string[],                   // Custom tags for filtering

  // Engagement (after publishing)
  metrics: {
    likes: number,
    comments: number,
    shares: number,
    impressions: number,
    reach: number,
    clicks: number
  } | null,

  // Collaboration
  comments: [
    {
      id: string,
      userId: string,
      userName: string,
      content: string,
      timestamp: Timestamp,
      resolved: boolean
    }
  ],

  // Version control
  versions: [
    {
      id: string,
      content: string,
      savedAt: Timestamp,
      savedBy: string
    }
  ]
}
```

### Campaign Document (optional grouping)

```javascript
{
  id: string,
  name: string,
  description: string,
  startDate: Timestamp,
  endDate: Timestamp,
  color: string,                    // For calendar visualization
  postIds: string[],
  createdBy: string,
  createdAt: Timestamp
}
```

### Content Template Document

```javascript
{
  id: string,
  name: string,
  description: string,
  platform: string | null,          // null = universal
  content: string,                  // Template with {{placeholders}}
  hashtags: string[],
  category: string,                 // 'promotional', 'educational', 'engagement', etc.
  createdBy: string,
  createdAt: Timestamp,
  usageCount: number
}
```

---

## UI Components

### Main Layout

The Social Media Planner page uses a multi-view layout with a persistent sidebar:

```
+------------------+----------------------------------------+
|                  |  [Calendar] [Kanban] [List] [Analytics]|
|    Sidebar       +----------------------------------------+
|                  |                                        |
|  - Quick Add     |                                        |
|  - Filters       |          Active View                   |
|  - Campaigns     |                                        |
|  - Templates     |                                        |
|  - Team          |                                        |
|                  |                                        |
+------------------+----------------------------------------+
```

### Sidebar

**Features:**
- Quick Add button (opens new post modal)
- Filter controls:
  - Platform filter (multi-select)
  - Stage filter (multi-select)
  - Assignee filter (team member dropdown)
  - Date range picker
  - Tag filter
- Campaign list with create new
- Template library access
- Team member quick view (who's assigned to what)

### Calendar View

**Features:**
- Month/Week/Day toggle
- Drag-and-drop post scheduling
- Color-coded by:
  - Stage (default)
  - Platform
  - Campaign
  - Priority
- Hover preview showing post content
- Click to open post detail modal
- Today indicator
- Best posting time suggestions (grayed time slots)
- Multi-platform posts shown as stacked cards

**Visual Structure:**
```
+--------+--------+--------+--------+--------+--------+--------+
|  Sun   |  Mon   |  Tue   |  Wed   |  Thu   |  Fri   |  Sat   |
+--------+--------+--------+--------+--------+--------+--------+
|        | [IG]   |        | [TW]   |        | [FB]   |        |
|        | [FB]   |        | [IG]   |        | [LI]   |        |
|        |        |        |        |        |        |        |
+--------+--------+--------+--------+--------+--------+--------+
```

### Kanban View

**Columns (configurable):**
1. Ideas
2. Drafting
3. In Review
4. Approved
5. Scheduled
6. Published

**Features:**
- Drag-and-drop between stages
- Card shows:
  - Title
  - Platform icons
  - Assigned creator avatar
  - Priority indicator
  - Scheduled date (if set)
  - Comment count
  - Media thumbnail preview
- Column post count
- Collapse/expand columns
- WIP limits (optional visual warning)
- Swimlanes by:
  - None (default)
  - Platform
  - Campaign
  - Assignee

**Card Structure:**
```
+---------------------------+
| [Platform Icons]  [!High] |
+---------------------------+
| Title of Post             |
| "Preview of content..."   |
+---------------------------+
| [Thumbnail] [Thumbnail]   |
+---------------------------+
| @Creator    Mar 15   [3💬]|
+---------------------------+
```

### List View

**Features:**
- Sortable table format
- Columns:
  - Status indicator
  - Title
  - Platforms
  - Stage
  - Creator
  - Scheduled Date
  - Priority
  - Tags
- Bulk actions:
  - Change stage
  - Assign creator
  - Delete
  - Archive
- Inline quick edit
- Row selection (checkbox)
- Export selected to CSV

### Post Editor Modal

**Features:**
- Split view: Editor | Preview
- Rich text toolbar (bold, italic, emoji picker, link)
- Platform tabs for variant editing
- Character count per platform (with limit warnings)
- Hashtag suggestions (based on content analysis)
- Media uploader:
  - Drag-and-drop zone
  - Paste from clipboard
  - Media library browser
  - Alt text editor
- Scheduling widget:
  - Date picker
  - Time picker
  - Timezone display
  - Best time recommendations
- Assignment section:
  - Creator dropdown
  - Reviewer dropdown
  - Notify on assign checkbox
- Internal notes (not published)
- Comment thread
- Version history dropdown
- Save as draft / Submit for review / Approve & Schedule buttons

**Layout:**
```
+------------------------------------------+
| Post Editor                        [X]   |
+------------------------------------------+
| Title: [                              ]  |
+------------------------------------------+
| [IG] [TW] [FB] [LI]                      |
+------------------------------------------+
|                    |  Preview            |
|  Write your post   | +----------------+  |
|  here...           | | [IG Preview]   |  |
|                    | |                |  |
|  145/280 chars     | |                |  |
|                    | +----------------+  |
+------------------------------------------+
| Media: [+Add] [Browse Library]           |
| [img1] [img2]                            |
+------------------------------------------+
| Schedule: [Mar 15, 2024] [10:30 AM]      |
|           EST - Best time: 11am          |
+------------------------------------------+
| Assignments:                             |
| Ideator: @Alex    Creator: [Select...]   |
| Reviewer: [Select...]                    |
+------------------------------------------+
| [Save Draft] [Submit for Review]         |
+------------------------------------------+
```

### Analytics Dashboard (sub-view)

**Features:**
- Post performance metrics
- Engagement rate comparison
- Best performing posts
- Platform breakdown
- Optimal posting time analysis
- Team productivity metrics:
  - Posts created per person
  - Average time in each stage
  - Review turnaround time

---

## User Interactions

### Quick Actions

| Action | Trigger | Result |
|--------|---------|--------|
| Quick Add | Click "+" or press `N` | Opens new post modal |
| Duplicate Post | Right-click → Duplicate | Creates copy in Ideas |
| Archive | Drag to archive or action menu | Moves to archived stage |
| Assign Self | Click "Assign to me" | Sets current user as creator |
| Move Stage | Drag card or use dropdown | Updates post stage |
| Schedule | Click date on calendar | Opens scheduler |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `N` | New post |
| `E` | Edit selected post |
| `1-6` | Move to stage (Ideas through Published) |
| `C` | Toggle calendar view |
| `K` | Toggle kanban view |
| `L` | Toggle list view |
| `/` | Focus search |
| `?` | Show keyboard shortcuts |

### Notifications

| Event | Recipients | Channel |
|-------|-----------|---------|
| Assigned as creator | Creator | In-app, Email |
| Post submitted for review | Reviewer | In-app, Email |
| Post approved | Creator, Ideator | In-app |
| Post published | Creator, Ideator | In-app |
| Comment added | All assignees | In-app |
| Upcoming scheduled post (1hr) | Publisher | In-app |
| Scheduled post failed | Creator, Publisher | In-app, Email |

---

## Validation Rules

### Content Validation

1. **Character Limits**
   - Check platform-specific limits before scheduling
   - Warning at 80% of limit
   - Error if exceeded

2. **Required Fields**
   - Title: Required (min 3 characters)
   - Content: Required for stages beyond "Idea"
   - Platform: At least one selected for scheduling

3. **Scheduling**
   - Cannot schedule in the past
   - Minimum 15 minutes from current time
   - Must have content and at least one platform

4. **Media**
   - Max 10 images per post
   - Max 1 video per post (platform-dependent)
   - File size limits per platform
   - Aspect ratio warnings for platform optimization

### Workflow Rules

1. **Stage Progression**
   - Ideas → Drafting: Automatic when content added
   - Drafting → Review: Requires content and platform
   - Review → Approved: Requires reviewer action
   - Approved → Scheduled: Requires date/time
   - Scheduled → Published: Automatic or manual

2. **Permissions**
   - Only reviewer can move Review → Approved
   - Only admin/publisher can force-publish
   - Anyone can move back to earlier stages

---

## Files Involved

| File | Purpose |
|------|---------|
| `src/pages/social/SocialPlanner.jsx` | Main page layout and view switching |
| `src/pages/social/CalendarView.jsx` | Calendar view component |
| `src/pages/social/KanbanView.jsx` | Kanban board component |
| `src/pages/social/ListView.jsx` | Table list view component |
| `src/pages/social/AnalyticsView.jsx` | Analytics dashboard |
| `src/components/social/PostCard.jsx` | Kanban/calendar post card |
| `src/components/social/PostEditor.jsx` | Full post editor modal |
| `src/components/social/PostPreview.jsx` | Platform-specific preview |
| `src/components/social/MediaUploader.jsx` | Media upload component |
| `src/components/social/PlatformSelector.jsx` | Multi-platform picker |
| `src/components/social/ScheduleWidget.jsx` | Date/time scheduler |
| `src/components/social/AssignmentPicker.jsx` | Team member assignment |
| `src/components/social/HashtagSuggester.jsx` | AI-powered hashtag suggestions |
| `src/components/social/CommentThread.jsx` | Internal comments |
| `src/hooks/useSocialPosts.js` | CRUD operations for posts |
| `src/hooks/useCampaigns.js` | Campaign management |
| `src/hooks/useContentTemplates.js` | Template library |
| `src/hooks/useSocialAnalytics.js` | Metrics and reporting |
| `src/styles/social-planner.css` | Social planner styles |

---

## CSS Classes

```css
/* Layout */
.social-planner
.social-planner-sidebar
.social-planner-main
.social-planner-header
.social-planner-view-tabs

/* Sidebar */
.sidebar-quick-add
.sidebar-filters
.sidebar-filter-group
.sidebar-campaigns
.sidebar-campaign-item
.sidebar-templates

/* Calendar View */
.calendar-container
.calendar-header
.calendar-grid
.calendar-day
.calendar-day.today
.calendar-day.has-posts
.calendar-post-card
.calendar-post-card.dragging

/* Kanban View */
.kanban-container
.kanban-column
.kanban-column-header
.kanban-column-count
.kanban-cards
.kanban-card
.kanban-card.dragging
.kanban-card-platforms
.kanban-card-title
.kanban-card-preview
.kanban-card-media
.kanban-card-footer
.kanban-add-card

/* List View */
.list-container
.list-header
.list-row
.list-row.selected
.list-cell
.list-bulk-actions

/* Post Card */
.post-card
.post-card-header
.post-card-platforms
.post-card-priority
.post-card-priority.high
.post-card-priority.urgent
.post-card-content
.post-card-media-preview
.post-card-footer
.post-card-assignee
.post-card-date
.post-card-comments

/* Post Editor */
.post-editor-modal
.post-editor-split
.post-editor-form
.post-editor-preview
.post-editor-toolbar
.post-editor-textarea
.post-editor-char-count
.post-editor-char-count.warning
.post-editor-char-count.error
.post-editor-media-zone
.post-editor-media-item
.post-editor-schedule
.post-editor-assignments
.post-editor-actions

/* Platform Tabs */
.platform-tabs
.platform-tab
.platform-tab.active
.platform-tab-icon
.platform-preview
.platform-preview-instagram
.platform-preview-twitter
.platform-preview-facebook
.platform-preview-linkedin

/* Assignment */
.assignment-section
.assignment-row
.assignment-label
.assignment-picker
.assignment-avatar
.assignment-name
.assignment-role

/* Stage Badges */
.stage-badge
.stage-badge.idea
.stage-badge.drafting
.stage-badge.review
.stage-badge.approved
.stage-badge.scheduled
.stage-badge.published
.stage-badge.archived

/* Priority */
.priority-indicator
.priority-low
.priority-medium
.priority-high
.priority-urgent
```

---

## Future Enhancements

1. **AI Content Generation**
   - Generate post drafts from ideas
   - Caption suggestions
   - Hashtag optimization
   - Best posting time prediction

2. **Direct Publishing Integration**
   - Connect to Instagram Graph API
   - Twitter/X API integration
   - Facebook Pages API
   - LinkedIn API
   - Auto-publish scheduled posts

3. **Content Library**
   - Centralized media storage
   - Brand assets folder
   - Stock photo integration
   - Canva/design tool embeds

4. **Approval Workflows**
   - Multi-stage approval chains
   - External client review links
   - Version comparison view
   - Legal/compliance review stage

5. **Content Recycling**
   - Evergreen post library
   - Auto-repost scheduling
   - Performance-based resharing

6. **Competitor Analysis**
   - Track competitor accounts
   - Engagement benchmarking
   - Trending content alerts

7. **Team Collaboration**
   - Real-time co-editing
   - @mentions in comments
   - Slack/Teams integration
   - Mobile app for on-the-go approvals

8. **Advanced Analytics**
   - ROI tracking
   - Conversion attribution
   - Audience growth metrics
   - Sentiment analysis

9. **Content Calendar Sharing**
   - Public calendar links for stakeholders
   - ICS/Google Calendar sync
   - Embed widgets

10. **A/B Testing**
    - Test multiple variants
    - Automatic winner selection
    - Statistical significance calculation

---

## Related Features

- **Team Management**: User roles and permissions for content approval
- **Contacts CRM**: Link posts to customer segments for targeted content
- **Activity Log**: Track all changes and actions on posts
- **File Storage**: Media asset management and organization
- **Notifications**: Real-time alerts for assignments and deadlines
- **Settings**: Default platforms, posting schedules, team preferences
