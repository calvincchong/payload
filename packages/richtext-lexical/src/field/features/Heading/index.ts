import type { HeadingTagType } from '@lexical/rich-text'
import type { LexicalEditor } from 'lexical'

import { $createHeadingNode, HeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'
import {
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
  FORMAT_TEXT_COMMAND,
} from 'lexical'

import type { Feature, FeatureProvider } from '../types'

import { SlashMenuOption } from '../../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/LexicalMenu'
import { BlockIcon } from '../../lexical/ui/icons/Block'
import { BoldIcon } from '../../lexical/ui/icons/Bold'
import { TextDropdownSectionWithEntries } from '../common/floatingSelectToolbarTextDropdownSection'
import { MarkdownTransformer } from './markdownTransformer'

// For SlashMenu, NOT for floating menu, as we would have to check if the selected node is ALREADY a heading for that first
const addHeading = (editor: LexicalEditor, headingSize: HeadingTagType) => {
  editor.update(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
      $setBlocksType(selection, () => $createHeadingNode(headingSize))
    }
  })
}

type Props = {
  enabledHeadingSizes?: HeadingTagType[]
}

export const HeadingFeature = (props: Props): FeatureProvider => {
  const { enabledHeadingSizes = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] } = props

  const toReturn: Feature = {
    floatingSelectToolbar: {
      sections: [
        TextDropdownSectionWithEntries([
          {
            ChildComponent: BoldIcon,
            isActive: (editor, selection) => selection.hasFormat('bold'),
            key: 'bold',
            onClick: (editor) => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')
            },
            order: 1,
          },
        ]),
      ],
    },
    markdownTransformers: [MarkdownTransformer],
    nodes: [HeadingNode],
    slashMenu: {
      options: [],
    },
  }

  for (const headingSize of enabledHeadingSizes) {
    toReturn.slashMenu.options.push({
      options: [
        new SlashMenuOption(`Heading ${headingSize.charAt(1)}`, {
          Icon: BlockIcon,
          keywords: ['heading', headingSize],
          onSelect: (editor) => {
            addHeading(editor, headingSize)
          },
        }),
      ],
      title: 'Basic',
    })
  }

  return {
    feature: ({ resolvedFeatures, unsanitizedEditorConfig }) => {
      return toReturn
    },
    key: 'heading',
  }
}
