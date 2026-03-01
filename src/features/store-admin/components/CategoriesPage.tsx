import { memo, useCallback, useState } from "react"
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useStoreCategories } from "../hooks/useStoreData"
import { newCategorySchema, type NewCategoryValues } from "../schemas"
import type { Category } from "../schemas"

const ICONS = ["hamburger", "fries", "beverage", "combo", "star"] as const

export const CategoriesPage = memo(function CategoriesPage() {
  const { categories, create, update, remove } = useStoreCategories()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const form = useForm<NewCategoryValues>({
    resolver: zodResolver(newCategorySchema) as Resolver<NewCategoryValues>,
    defaultValues: { name: "", icon: "hamburger" },
  })

  const handleOpenNew = useCallback(() => {
    setEditing(null)
    form.reset({ name: "", icon: "hamburger" })
    setModalOpen(true)
  }, [form])

  const handleOpenEdit = useCallback(
    (cat: Category) => {
      setEditing(cat)
      form.reset({ name: cat.name, icon: cat.icon })
      setModalOpen(true)
    },
    [form]
  )

  const handleSubmit = useCallback(
    (data: NewCategoryValues) => {
      if (editing) {
        update(editing.id, { name: data.name, icon: data.icon })
      } else {
        create({ name: data.name, icon: data.icon })
      }
      setModalOpen(false)
    },
    [editing, create, update]
  )

  const handleDelete = useCallback(
    (id: number) => {
      if (confirm("Excluir esta categoria?")) remove(id)
    },
    [remove]
  )

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Categorias
          </h1>
          <p className="mt-1 text-muted-foreground">
            Gerencie as categorias do cardápio
          </p>
        </div>
        <Button onClick={handleOpenNew}>
          <FiPlus className="mr-2 size-4" />
          Nova categoria
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <div className="font-semibold">{cat.name}</div>
                <div className="text-sm text-muted-foreground">
                  Ícone: {cat.icon}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleOpenEdit(cat)}
                >
                  <FiEdit2 className="size-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(cat.id)}
                >
                  <FiTrash2 className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar categoria" : "Nova categoria"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Hambúrgueres" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o ícone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ICONS.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editing ? "Salvar" : "Criar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
})
