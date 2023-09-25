import { INSERT_CHECK_LIST_COMMAND, ListItemNode, ListNode } from '@lexical/list'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'

import type { FeatureProvider } from '../../types'

import { SlashMenuOption } from '../../../lexical/plugins/SlashMenu/LexicalTypeaheadMenuPlugin/LexicalMenu'
import { ChecklistIcon } from '../../../lexical/ui/icons/Checklist'

export const CheckListFeature = (): FeatureProvider => {
  return {
    feature: ({ featureProviderMap, resolvedFeatures, unsanitizedEditorConfig }) => {
      return {
        nodes:
          featureProviderMap.has('unorderedList') || featureProviderMap.has('orderedList')
            ? []
            : [ListItemNode, ListNode],
        plugins: [
          {
            Component: CheckListPlugin,
            position: 'normal',
          },
        ],
        slashMenu: {
          options: [
            {
              options: [
                new SlashMenuOption('CheckList', {
                  Icon: ChecklistIcon,
                  keywords: ['check list', 'check', 'checklist', 'cl'],
                  onSelect: ({ editor }) => {
                    editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
                  },
                }),
              ],
              title: 'Lists',
            },
          ],
        },
      }
    },
    key: 'checkList',
  }
}
